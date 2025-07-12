class FerrisWheelNavigation {
  constructor() {
    this.spokeSystem = document.getElementById('spokeSystem');
    this.spokes = document.querySelectorAll('.spoke');
    this.currentRotation = 0;
    this.isRotating = false;
    
    this.init();
  }

  init() {
    if (!this.spokeSystem || !this.spokes.length) {
      console.error('Navigation elements not found');
      return;
    }

    // Set initial positions
    this.setInitialPositions();
    
    // Add event listeners
    this.addEventListeners();
    
    // Set the correct active spoke based on current page
    this.setActiveSpokeForCurrentPage();
  }

  setActiveSpokeForCurrentPage() {
    // Get current page name from URL
    const currentPage = this.getCurrentPageName();
    console.log('Current page:', currentPage);
    
    // Find and activate the corresponding spoke
    const activeSpoke = document.querySelector(`.spoke[data-page="${currentPage}"]`);
    if (activeSpoke) {
      // Remove active class from all spokes
      this.spokes.forEach(spoke => spoke.classList.remove('active'));
      
      // Add active class to current page spoke
      activeSpoke.classList.add('active');
      
      // Rotate to show active spoke at 180 degrees
      const targetAngle = parseInt(activeSpoke.dataset.angle);
      const rotationNeeded = 180 - targetAngle;
      this.currentRotation = rotationNeeded;
      
      // Apply initial rotation without animation
      this.spokeSystem.style.transition = 'none';
      this.spokeSystem.style.transform = `rotate(${this.currentRotation}deg)`;
      
      // Update label counter-rotations
      this.updateLabelRotations();
      
      // Re-enable transitions after a brief delay
      setTimeout(() => {
        if (this.spokeSystem) {
          this.spokeSystem.style.transition = 'transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
      }, 50);
    }
  }

  getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Map filenames to page names
    const pageMap = {
      'index.html': 'home',
      '': 'home', // for root path
      'blog.html': 'blog',
      'contact.html': 'contact',
      'projects.html': 'projects',
      'publications.html': 'publications'
    };
    
    return pageMap[filename] || 'home';
  }

  setInitialPositions() {
    this.spokes.forEach(spoke => {
      const angle = parseInt(spoke.dataset.angle);
      spoke.style.transform = `rotate(${angle}deg)`;
    });
    
    this.updateLabelRotations();
  }

  updateLabelRotations() {
    this.spokes.forEach(spoke => {
      const originalAngle = parseInt(spoke.dataset.angle);
      const newAngle = originalAngle + this.currentRotation;
      
      // Counter-rotate labels to keep them upright
      const label = spoke.querySelector('.spoke-label');
      if (label) {
        label.style.transform = `translateY(-50%) rotate(${-newAngle}deg)`;
      }
    });
  }

  addEventListeners() {
    // Add click listeners to spoke labels
    this.spokes.forEach(spoke => {
      const label = spoke.querySelector('.spoke-label');
      if (label) {
        label.addEventListener('click', (e) => this.handleLabelClick(e, spoke));
      }
    });

    // Add click listener to profile image (return to home)
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
      profileImage.style.cursor = 'pointer';
      profileImage.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  handleLabelClick(event, spoke) {
    if (this.isRotating) {
      event.preventDefault();
      return;
    }

    const targetAngle = parseInt(spoke.dataset.angle);
    const isAlreadyActive = spoke.classList.contains('active');
    const href = spoke.querySelector('.spoke-label').getAttribute('href');

    console.log('Label clicked:', spoke.dataset.page, 'Already active:', isAlreadyActive);

    // If it's already active, navigate immediately
    if (isAlreadyActive) {
      return; // Allow default navigation
    }

    // Prevent default navigation
    event.preventDefault();

    // Update active state immediately
    this.setActiveSpoke(spoke);

    // Rotate to position first, then navigate
    this.rotateToPosition(targetAngle, () => {
      // After rotation, navigate to the page
      window.location.href = href;
    });
  }

  rotateToPosition(targetAngle, callback) {
    if (this.isRotating) return;

    this.isRotating = true;
    
    // Calculate rotation needed to bring target to 180 degrees
    const rotationNeeded = 180 - targetAngle;
    this.currentRotation += rotationNeeded;

    console.log('Rotating by:', rotationNeeded, 'Total rotation:', this.currentRotation);

    // Apply rotation to the spoke system
    this.spokeSystem.style.transform = `rotate(${this.currentRotation}deg)`;

    // Update label counter-rotations
    this.updateLabelRotations();

    // Execute callback after animation completes
    setTimeout(() => {
      this.isRotating = false;
      if (callback) callback();
    }, 1200); // Match CSS transition duration
  }

  setActiveSpoke(activeSpoke) {
    // Remove active class from all spokes
    this.spokes.forEach(spoke => spoke.classList.remove('active'));
    
    // Add active class to the target spoke
    activeSpoke.classList.add('active');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing navigation...');
  new FerrisWheelNavigation();
});