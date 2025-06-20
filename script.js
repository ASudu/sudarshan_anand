class FerrisWheelNavigation {
  constructor() {
    this.spokeSystem = document.getElementById('spokeSystem');
    this.spokes = document.querySelectorAll('.spoke');
    this.currentRotation = 0;
    this.isAnimating = false;
    
    this.init();
  }
  
  init() {
    // Position all spokes initially
    this.spokes.forEach(spoke => {
      const angle = parseFloat(spoke.getAttribute('data-angle'));
      this.positionSpoke(spoke, angle);
      
      // Add click event listener
      spoke.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.rotateTo(angle);
          this.setActiveSpoke(spoke);
        }
      });
    });
    
    // Set Home as default active
    const homeSpoke = document.querySelector('.spoke[data-angle="180"]');
    this.setActiveSpoke(homeSpoke);
  }
  
  positionSpoke(spoke, angle) {
    const radians = (angle * Math.PI) / 180;
    spoke.style.transform = `rotate(${angle}deg)`;
    
    // The label should not rotate with the spoke
    const label = spoke.querySelector('.spoke-label');
    if (label) {
      label.style.transform = `translateY(-50%) rotate(${-angle}deg)`;
    }
  }
  
  rotateTo(targetAngle) {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    
    // Calculate the rotation needed to bring the target spoke to 180 degrees (pi radians)
    const rotationNeeded = 180 - targetAngle;
    
    // Add the rotation needed to current rotation
    this.currentRotation += rotationNeeded;
    
    // Apply the rotation to the spoke system
    this.spokeSystem.style.transform = `rotate(${this.currentRotation}deg)`;
    
    // Update all spoke labels to counter-rotate so they stay upright
    this.spokes.forEach(spoke => {
      const originalAngle = parseFloat(spoke.getAttribute('data-angle'));
      const currentAngle = originalAngle + this.currentRotation;
      
      const label = spoke.querySelector('.spoke-label');
      if (label) {
        // Counter-rotate the label to keep it upright
        label.style.transform = `translateY(-50%) rotate(${-currentAngle}deg)`;
      }
    });
    
    // Reset animation flag after animation completes
    setTimeout(() => {
      this.isAnimating = false;
    }, 1200); // Match the CSS transition duration
  }
  
  setActiveSpoke(activeSpoke) {
    // Remove active class from all spokes
    this.spokes.forEach(spoke => {
      spoke.classList.remove('active');
    });
    
    // Add active class to the clicked spoke
    activeSpoke.classList.add('active');
    
    // Handle page navigation (you can expand this)
    const page = activeSpoke.getAttribute('data-page');
    this.handlePageNavigation(page);
  }
  
  handlePageNavigation(page) {
    // This function can be expanded to handle actual page navigation
    console.log(`Navigating to: ${page}`);
    
    // For now, just update the URL hash
    window.location.hash = page;
    
    // You can add actual page loading logic here
    // For example, loading different content based on the selected tab
  }
}

// Initialize the navigation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FerrisWheelNavigation();
});

// Handle browser back/forward buttons
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'home';
  const targetSpoke = document.querySelector(`[data-page="${hash}"]`);
  
  if (targetSpoke && !targetSpoke.classList.contains('active')) {
    const navigation = new FerrisWheelNavigation();
    const angle = parseFloat(targetSpoke.getAttribute('data-angle'));
    navigation.rotateTo(angle);
    navigation.setActiveSpoke(targetSpoke);
  }
});