// Simple Ferris Wheel Navigation
let currentRotation = 0;

function initNavigation() {
  const spokes = document.querySelectorAll('.spoke');
  const spokeSystem = document.getElementById('spokeSystem');
  
  if (!spokes.length || !spokeSystem) {
    console.error('Navigation elements not found');
    return;
  }
  
  console.log('Found', spokes.length, 'spokes');
  
  spokes.forEach(spoke => {
    // Handle spoke rotation on click
    spoke.addEventListener('click', function(e) {
      // Prevent immediate navigation
      e.preventDefault();
      
      console.log('Spoke clicked:', this.getAttribute('data-angle'));
      
      const targetAngle = parseFloat(this.getAttribute('data-angle'));
      const rotationNeeded = 180 - targetAngle;
      currentRotation += rotationNeeded;
      
      // Rotate the spoke system
      spokeSystem.style.transform = `rotate(${currentRotation}deg)`;
      
      // Update all labels and active states
      spokes.forEach(s => {
        const originalAngle = parseFloat(s.getAttribute('data-angle'));
        const newAngle = originalAngle + currentRotation;
        const label = s.querySelector('.spoke-label');
        
        if (label) {
          label.style.transform = `translateY(-50%) rotate(${-newAngle}deg)`;
          // Store current rotation for hover/active states
          s.style.setProperty('--current-label-rotation', `${-newAngle}deg`);
        }
        
        s.classList.remove('active');
      });
      
      this.classList.add('active');
      
      // Navigate to the page after rotation animation completes
      const link = this.querySelector('.spoke-label');
      if (link && link.href) {
        setTimeout(() => {
          window.location.href = link.href;
        }, 1200); // Wait for rotation animation to complete
      }
    });
    
    // Handle direct link clicks (for accessibility)
    const label = spoke.querySelector('.spoke-label');
    if (label) {
      label.addEventListener('click', function(e) {
        // If the spoke is not active, prevent immediate navigation and trigger spoke rotation
        if (!spoke.classList.contains('active')) {
          e.preventDefault();
          spoke.click(); // This will trigger the rotation and delayed navigation
        }
        // If the spoke is already active, allow normal navigation
      });
    }
  });
}

// Initialize immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}