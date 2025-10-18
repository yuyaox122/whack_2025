'use client';

import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

export default function BubbleMap({ data, width = 800, height = 600, onItemClick }) {
  const svgRef = useRef(null);
  const physicsRef = useRef(null);
  const initializedRef = useRef(false);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    // Always clear and reinitialize to ensure consistency
    svg.selectAll('*').remove();

    // Define center coordinates first
    const centerX = width / 2;
    const centerY = height / 2;

    // Helper function to wrap text
    function wrapText(text, charsPerLine) {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      words.forEach(word => {
        if ((currentLine + word).length <= charsPerLine) {
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            // If a single word is longer than charsPerLine, split it
            lines.push(word.slice(0, charsPerLine));
            currentLine = word.slice(charsPerLine);
          }
        }
      });

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    }

    // Create a container group
    const container = svg.append('g');

    // Calculate bubble sizes based on text length instead of values
    const textLengths = data.map(d => d.title.length);
    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(textLengths), d3.max(textLengths)])
      .range([40, 120]); // Larger range for text-based sizing

    // Create bubbles with physics simulation
    const bubbles = container.selectAll('g')
      .data(data)
      .join('g')
      .attr('class', 'bubble')
      .style('cursor', 'pointer');

    // Initial positioning - distribute bubbles in a circle
    const radius = Math.min(width, height) / 3;

    bubbles.each(function(d, i) {
      const angle = (i / data.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const r = sizeScale(d.title.length);
      
      d.x = x;
      d.y = y;
      d.r = r;
      d.vx = (Math.random() - 0.5) * 2; // Random velocity
      d.vy = (Math.random() - 0.5) * 2;
    });

    // Create circles with relative text sizing
    bubbles.each(function(d) {
      const g = d3.select(this);
      
      // Add circle
      g.append('circle')
        .attr('r', 0)
        .attr('fill', d.color)
        .attr('fill-opacity', 0.8)
        .attr('stroke', 'rgba(255,255,255,0.3)')
        .attr('stroke-width', 2)
        .attr('filter', 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))')
        .transition()
        .duration(1200)
        .ease(d3.easeBackOut)
        .attr('r', d.r);

      // Add wrapped text that fits within the bubble
      const fontSize = Math.max(10, Math.min(16, d.r / 8));
      const charsPerLine = Math.floor((d.r * 2 * 0.8) / (fontSize * 0.6)); // Estimate chars per line
      const lines = wrapText(d.title, charsPerLine);
      const lineHeight = fontSize * 1.2;
      const totalHeight = lines.length * lineHeight;
      const startY = -(totalHeight / 2) + (lineHeight / 2);
      
      lines.forEach((line, lineIndex) => {
        g.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .attr('y', startY + (lineIndex * lineHeight))
          .attr('font-size', 0) // Start with 0 for animation
          .attr('font-weight', '600')
          .attr('fill', 'white')
          .attr('opacity', 0)
          .text(line)
          .transition()
          .delay(600 + (lineIndex * 100))
          .duration(800)
          .attr('font-size', fontSize)
          .attr('opacity', 1);
      });
    });

    // Position the bubbles
    bubbles.attr('transform', d => `translate(${d.x},${d.y})`);

    // Physics simulation
    const friction = 0.99;
    const bounce = 0.8;
    const centerGravity = 0.02; // Pull toward center
    
    // Drag state
    let draggedBubble = null;
    let dragOffset = { x: 0, y: 0 };
    let isDragging = false;
    let wasDragging = false;
    let dragStartPos = { x: 0, y: 0 };
    let dragThreshold = 5; // Minimum distance to consider it a drag

    function physicsStep() {
      bubbles.each(function(d) {
        // Skip physics for dragged bubble
        if (d === draggedBubble) return;
        
        // Apply center gravity
        const dx = centerX - d.x;
        const dy = centerY - d.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          const gravityForce = centerGravity * (distance / 100); // Stronger gravity for farther bubbles
          d.vx += (dx / distance) * gravityForce;
          d.vy += (dy / distance) * gravityForce;
        }
        
        // Apply friction
        d.vx *= friction;
        d.vy *= friction;
        
        // Update position
        d.x += d.vx;
        d.y += d.vy;
        
        // Boundary collisions
        if (d.x - d.r < 0) {
          d.x = d.r;
          d.vx = -d.vx * bounce;
        }
        if (d.x + d.r > width) {
          d.x = width - d.r;
          d.vx = -d.vx * bounce;
        }
        if (d.y - d.r < 0) {
          d.y = d.r;
          d.vy = -d.vy * bounce;
        }
        if (d.y + d.r > height) {
          d.y = height - d.r;
          d.vy = -d.vy * bounce;
        }
        
        // Bubble-to-bubble collisions
        bubbles.each(function(other) {
          if (d === other) return;
          
          const dx = d.x - other.x;
          const dy = d.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = d.r + other.r;
          
          if (distance < minDistance) {
            // Collision detected
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            // Separate bubbles
            d.x += separationX;
            d.y += separationY;
            other.x -= separationX;
            other.y -= separationY;
            
            // Transfer momentum
            const normalX = dx / distance;
            const normalY = dy / distance;
            const relativeVelocityX = d.vx - other.vx;
            const relativeVelocityY = d.vy - other.vy;
            const speed = relativeVelocityX * normalX + relativeVelocityY * normalY;
            
            if (speed > 0) return; // Bubbles are separating
            
            const impulse = 2 * speed / (1 + 1); // Assuming equal mass
            d.vx -= impulse * normalX;
            d.vy -= impulse * normalY;
            other.vx += impulse * normalX;
            other.vy += impulse * normalY;
          }
        });
      });
      
      // Update positions
      bubbles.attr('transform', d => `translate(${d.x},${d.y})`);
      
      // Update text sizes based on current bubble size
      bubbles.selectAll('text')
        .each(function(d) {
          const fontSize = Math.max(10, Math.min(16, d.r / 8));
          const charsPerLine = Math.floor((d.r * 2 * 0.8) / (fontSize * 0.6));
          const lines = wrapText(d.title, charsPerLine);
          const lineHeight = fontSize * 1.2;
          const totalHeight = lines.length * lineHeight;
          const startY = -(totalHeight / 2) + (lineHeight / 2);
          
          d3.select(this)
            .attr('font-size', fontSize);
        });
      
      animationIdRef.current = requestAnimationFrame(physicsStep);
    }

    // Add global mouse events for dragging
    const handleMouseMove = (event) => {
      if (!draggedBubble) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      
      // Check if we've moved enough to consider it a drag
      const distance = Math.sqrt(
        Math.pow(currentX - dragStartPos.x, 2) + 
        Math.pow(currentY - dragStartPos.y, 2)
      );
      
      if (distance > dragThreshold) {
        isDragging = true;
        wasDragging = true;
      }
      
      if (isDragging) {
        draggedBubble.x = currentX - dragOffset.x;
        draggedBubble.y = currentY - dragOffset.y;
        
        // Keep bubble within bounds
        draggedBubble.x = Math.max(draggedBubble.r, Math.min(width - draggedBubble.r, draggedBubble.x));
        draggedBubble.y = Math.max(draggedBubble.r, Math.min(height - draggedBubble.r, draggedBubble.y));
      }
    };

    const handleMouseUp = () => {
      if (draggedBubble) {
        // Remove visual feedback
        bubbles.selectAll('circle')
          .attr('stroke-width', 2)
          .attr('stroke', 'rgba(255,255,255,0.3)');
        
        // Add some velocity when releasing
        draggedBubble.vx = (Math.random() - 0.5) * 3;
        draggedBubble.vy = (Math.random() - 0.5) * 3;
        
        // Reset drag state but keep wasDragging flag for a short time
        draggedBubble = null;
        isDragging = false;
        
        // Clear the wasDragging flag after a short delay to allow click events to check it
        setTimeout(() => {
          wasDragging = false;
        }, 50);
      }
    };

    // Add event listeners
    svg.on('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Start physics simulation
    setTimeout(() => {
      physicsStep();
    }, 1500); // Wait for initial animations to complete

    // Add hover effects
    bubbles
      .on('mouseenter', function(event, d) {
        const bubble = d3.select(this);
        const circle = bubble.select('circle');
        const text = bubble.select('text');
        
        // Store original size
        if (!d.originalR) d.originalR = d.r;
        
        // Grow bubble
        d.r *= 1.2;
        circle
          .transition()
          .duration(200)
          .attr('r', d.r)
          .attr('fill-opacity', 0.9);
        
        // Update text size for hover
        const fontSize = Math.max(10, Math.min(16, d.r / 8));
        text
          .transition()
          .duration(200)
          .attr('font-size', fontSize)
          .attr('font-weight', '700');
      })
      .on('mouseleave', function(event, d) {
        const bubble = d3.select(this);
        const circle = bubble.select('circle');
        const text = bubble.select('text');
        
        // Restore original size
        if (d.originalR) {
          d.r = d.originalR;
        }
        
        circle
          .transition()
          .duration(200)
          .attr('r', d.r)
          .attr('fill-opacity', 0.8);
        
        // Restore text size
        const fontSize = Math.max(10, Math.min(16, d.r / 8));
        text
          .transition()
          .duration(200)
          .attr('font-size', fontSize)
          .attr('font-weight', '600');
      })
      .on('click', function(event, d) {
        event.preventDefault();
        // Only trigger click if we're not dragging and haven't just finished dragging
        if (!isDragging && !wasDragging && onItemClick) {
          onItemClick(d);
        }
      })
      .on('mousedown', function(event, d) {
        event.preventDefault();
        // Start potential drag
        draggedBubble = d;
        const rect = svgRef.current.getBoundingClientRect();
        dragOffset.x = event.clientX - rect.left - d.x;
        dragOffset.y = event.clientY - rect.top - d.y;
        
        // Record starting position for drag detection
        dragStartPos.x = event.clientX - rect.left;
        dragStartPos.y = event.clientY - rect.top;
        
        // Reset drag state
        isDragging = false;
        wasDragging = false;
        
        // Stop the bubble's velocity
        d.vx = 0;
        d.vy = 0;
        
        // Add visual feedback
        d3.select(this).select('circle')
          .attr('stroke-width', 4)
          .attr('stroke', 'rgba(255,255,255,0.8)');
      });

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      document.removeEventListener('mouseup', handleMouseUp);
      svg.on('mousemove', null);
    };

  }, [data, width, height, onItemClick]);

  return (
    <div className="flex justify-center items-center w-full">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        className="drop-shadow-2xl"
        style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
      />
    </div>
  );
}