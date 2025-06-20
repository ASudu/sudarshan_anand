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
    spoke.addEventListener('click', function() {
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
    });
  });
}

// Initialize immediately if DOM is ready, or wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}