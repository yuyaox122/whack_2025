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
    
    // Always clear and reinitialize for clean, predictable behavior
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

    // Add gradient definition for green button
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'greenGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981'); // emerald-600
    
    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#84cc16'); // lime-400
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981'); // emerald-600

    // Add hover gradient definition
    const hoverGradient = defs.append('linearGradient')
      .attr('id', 'greenGradientHover')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    
    hoverGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#059669'); // emerald-500 (darker)
    
    hoverGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#65a30d'); // lime-500 (darker)
    
    hoverGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#059669'); // emerald-500 (darker)

    // Use only the provided data (no add button)
    const bubbleData = data;

    // Calculate bubble sizes based on text length (Birdeye style)
    const textLengths = bubbleData.map(d => d.title.length);
    const sizeScale = d3.scaleSqrt()
      .domain([d3.min(textLengths), d3.max(textLengths)])
      .range([50, 120]); // Larger bubbles for desktop

    // Create bubbles
    const bubbles = container.selectAll('g.bubble')
      .data(bubbleData)
      .join('g')
      .attr('class', 'bubble')
      .style('cursor', 'pointer');

    // Initial positioning - distribute bubbles in a circle
    const radius = Math.min(width, height) / 3;

    // Position bubbles
    bubbles.each(function(d, i) {
      const angle = (i / bubbleData.length) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const r = sizeScale(d.title.length);
      
      d.x = x;
      d.y = y;
      d.r = r;
      d.vx = (Math.random() - 0.5) * 2; // Reduced initial velocity for calmer start
      d.vy = (Math.random() - 0.5) * 2;
    });

    // Create bubbles
    bubbles.each(function(d) {
      const g = d3.select(this);
      
      // Add circle for bubbles
      g.append('circle')
        .attr('r', 0)
        .attr('fill', d.color)
        .attr('fill-opacity', 0.9)
        .attr('stroke', 'rgba(255,255,255,0.8)')
        .attr('stroke-width', 1.5)
        .attr('filter', 'drop-shadow(0 2px 12px rgba(0,0,0,0.15))')
        .transition()
        .duration(1200)
        .ease(d3.easeBackOut)
        .attr('r', d.r);
    });

    // Add text to regular bubbles
    bubbles.each(function(d) {
      const g = d3.select(this);
        // Add wrapped text that fits within the bubble (Birdeye style)
        const fontSize = Math.max(12, Math.min(16, d.r / 6));
      const charsPerLine = Math.floor((d.r * 2 * 0.8) / (fontSize * 0.6)); // Estimate chars per line
      const lines = wrapText(d.title, charsPerLine);
        const lineHeight = fontSize * 1.1;
      const totalHeight = lines.length * lineHeight;
      const startY = -(totalHeight / 2) + (lineHeight / 2);
      
      lines.forEach((line, lineIndex) => {
        g.append('text')
          .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
          .attr('y', startY + (lineIndex * lineHeight))
          .attr('font-size', 0) // Start with 0 for animation
            .attr('font-weight', '500')
            .attr('fill', 'rgba(255,255,255,0.95)')
            .attr('font-family', 'Space Grotesk, sans-serif')
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
    const friction = 0.98; // More friction to reduce momentum conservation
    const bounce = 0.75; // Less bounce for calmer movement
    const maxVelocity = 8; // Maximum velocity to prevent bubbles from moving too fast
    const centerGravity = 0.002; // Weaker gravity toward center
    const softening = 0.1; // Softening factor for collisions
    
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
        
        // Apply gentle center gravity
        const dx = centerX - d.x;
        const dy = centerY - d.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 0) {
          const gravityForce = centerGravity * (distance / 200); // Gentle pull toward center
          d.vx += (dx / distance) * gravityForce;
          d.vy += (dy / distance) * gravityForce;
        }
        
        // Apply friction (but preserve more momentum)
        d.vx *= friction;
        d.vy *= friction;
        
        // No random momentum injection - bubbles only move from gravity and user interaction
        
        // Limit maximum velocity to prevent bubbles from moving too fast
        const finalSpeed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (finalSpeed > maxVelocity) {
          d.vx = (d.vx / finalSpeed) * maxVelocity;
          d.vy = (d.vy / finalSpeed) * maxVelocity;
        }
        
        // Update position
        d.x += d.vx;
        d.y += d.vy;
        
        // Boundary collisions with softening
        if (d.x - d.r < 0) {
          d.x = d.r;
          d.vx = -d.vx * bounce * (1 - softening); // Softer boundary bounce
        }
        if (d.x + d.r > width) {
          d.x = width - d.r;
          d.vx = -d.vx * bounce * (1 - softening);
        }
        if (d.y - d.r < 0) {
          d.y = d.r;
          d.vy = -d.vy * bounce * (1 - softening);
        }
        if (d.y + d.r > height) {
          d.y = height - d.r;
          d.vy = -d.vy * bounce * (1 - softening);
        }
        
        // Bubble-to-bubble collisions
        bubbles.each(function(other) {
          if (d === other) return;
          
          const dx = d.x - other.x;
          const dy = d.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = d.r + other.r;
          
          if (distance < minDistance) {
            // Collision detected - bubbles just stop
            const overlap = minDistance - distance;
            const separationX = (dx / distance) * overlap * 0.5;
            const separationY = (dy / distance) * overlap * 0.5;
            
            // Separate bubbles
            d.x += separationX;
            d.y += separationY;
            other.x -= separationX;
            other.y -= separationY;
            
            // Stop both bubbles (no momentum transfer)
            d.vx = 0;
            d.vy = 0;
            other.vx = 0;
            other.vy = 0;
          }
        });
      });
      
      // Update positions
      bubbles.attr('transform', d => `translate(${d.x},${d.y})`);
      
      // Update text sizes based on current bubble size
      bubbles.selectAll('text')
        .each(function(d) {
          const fontSize = Math.max(11, Math.min(18, d.r / 7));
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
        
        // Add momentum when releasing (reduced for calmer movement)
        const dragDistance = Math.sqrt(
          Math.pow(draggedBubble.x - dragStartPos.x, 2) + 
          Math.pow(draggedBubble.y - dragStartPos.y, 2)
        );
        const momentumFactor = Math.min(dragDistance / 100, 1); // Reduced momentum scaling
        
        draggedBubble.vx = (Math.random() - 0.5) * 2 * momentumFactor; // Reduced release momentum
        draggedBubble.vy = (Math.random() - 0.5) * 2 * momentumFactor;
        
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

    // Add hover effects for regular bubbles
    bubbles
      .on('mouseenter', function(event, d) {
        const bubble = d3.select(this);
        const shape = bubble.select('circle');
        const text = bubble.select('text');
        
        // Store original size
        if (!d.originalR) d.originalR = d.r;
        
        // Grow shape
        d.r *= 1.2;
        
        // Update circle for regular bubbles (Birdeye style)
        shape
          .transition()
          .duration(150)
          .attr('r', d.r)
          .attr('fill-opacity', 1.0)
          .attr('stroke', 'rgba(255,255,255,1)')
          .attr('stroke-width', 2)
          .attr('filter', 'drop-shadow(0 4px 20px rgba(0,0,0,0.25))');
      
        // Update text size for hover
        const fontSize = Math.max(12, Math.min(16, d.r / 6));
        text
          .transition()
          .duration(150)
          .attr('font-size', fontSize)
          .attr('font-weight', '600')
          .attr('fill', 'white');
      })
      .on('mouseleave', function(event, d) {
        const bubble = d3.select(this);
        const shape = bubble.select('circle');
        const text = bubble.select('text');
        
        // Restore original size
        if (d.originalR) {
          d.r = d.originalR;
        }
        
        // Update circle for regular bubbles (restore Birdeye style)
        shape
          .transition()
          .duration(150)
          .attr('r', d.r)
          .attr('fill-opacity', 0.9)
          .attr('stroke', 'rgba(255,255,255,0.8)')
          .attr('stroke-width', 1.5)
          .attr('filter', 'drop-shadow(0 2px 12px rgba(0,0,0,0.15))');
      
        // Restore text size
        const fontSize = Math.max(12, Math.min(16, d.r / 6));
        text
          .transition()
          .duration(150)
          .attr('font-size', fontSize)
          .attr('font-weight', '500')
          .attr('fill', 'rgba(255,255,255,0.95)');
      })
      .on('click', function(event, d) {
        event.preventDefault();
        // Only trigger click if we're not dragging and haven't just finished dragging
        if (!isDragging && !wasDragging) {
          if (onItemClick) {
            onItemClick(d);
          }
        }
      })
      .on('mousedown', function(event, d) {
        event.preventDefault();
        // Don't allow dragging on the add bubble
        if (d.isAddBubble) return;
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
        className="drop-shadow-lg"
        style={{ 
          border: '1px solid rgba(255,255,255,0.08)', 
          borderRadius: '16px',
          backgroundColor: 'rgba(0,0,0,0.02)'
        }}
      />
    </div>
  );
}