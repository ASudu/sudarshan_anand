// FerrisWheelNavigation class handles interactive navigation using a rotating wheel UI
class FerrisWheelNavigation {
  constructor() {
    // Get the main spoke system element
    this.spokeSystem = document.getElementById('spokeSystem');
    // Get all spoke elements
    this.spokes = document.querySelectorAll('.spoke');
    // Track the current rotation angle of the wheel
    this.currentRotation = 0;
    // Flag to prevent overlapping rotations
    this.isRotating = false;
    
    // Initialize navigation logic
    this.init();
  }

  // Initialize the navigation system
  init() {
    // Check if spoke system and spokes exist
    if (!this.spokeSystem || !this.spokes.length) {
      console.error('Navigation elements not found');
      return;
    }

    // Set initial positions of spokes and labels
    this.setInitialPositions();
    
    // Attach event listeners for navigation interactions
    this.addEventListeners();
    
    // Highlight the spoke corresponding to the current page
    this.setActiveSpokeForCurrentPage();
  }

  // Set initial positions of spokes and their labels
  setInitialPositions() {
    // Position each spoke at its designated angle
    this.spokes.forEach(spoke => {
      const angle = parseInt(spoke.dataset.angle);
      console.log('Setting spoke angle:', angle);
      // Rotate the spoke to its angle around the wheel
      spoke.style.transform = `rotate(${angle}deg)`;
    });
    
    // Counter-rotate labels so they remain upright
    this.updateLabelRotations();
  }

  // Set the active spoke based on the current page
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
      const currAngle = (parseInt(activeSpoke.dataset.angle)) % 360;
      console.log('Active spoke angle:', currAngle);
      const rotationNeeded = 180 - currAngle;
      this.currentRotation = Math.min(rotationNeeded, 360 - rotationNeeded);
      console.log('Initial rotation needed:', rotationNeeded, 'Total rotation:', this.currentRotation);
      
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

  // Get the logical page name from the current URL
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

  // Update label rotations to keep them upright as the wheel rotates
  updateLabelRotations() {
    this.spokes.forEach(spoke => {
      // Get the current angle of the spoke
      const currAngle = (parseInt(spoke.dataset.angle)) % 360;
      // Calculate the new angle after wheel rotation
      const newAngle = currAngle + this.currentRotation;
      
      // Find the label element inside the spoke
      const label = spoke.querySelector('.spoke-label');
      if (label) {
        // Counter-rotate the label so it remains upright
        label.style.transform = `translateY(-50%) rotate(${-newAngle}deg)`;
      }
    });
  }

  // Attach event listeners for navigation and profile image
  addEventListeners() {
    // Add click listeners to spoke labels for navigation
    this.spokes.forEach(spoke => {
      const label = spoke.querySelector('.spoke-label');
      if (label) {
        // When a spoke label is clicked, handle navigation and rotation
        label.addEventListener('click', (e) => this.handleLabelClick(e, spoke));
      }
    });

    // Add click listener to profile image to return to home page
    const profileImage = document.getElementById('profileImage');
    if (profileImage) {
      profileImage.style.cursor = 'pointer';
      // When profile image is clicked, navigate to home (index.html)
      profileImage.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }
  }

  // Handle click events on spoke labels for navigation and rotation
  handleLabelClick(event, spoke) {
    // Prevent interaction if a rotation is already in progress
    if (this.isRotating) {
      event.preventDefault();
      return;
    }

    // Get the angle and navigation target for the clicked spoke
    const currAngle = parseInt(spoke.dataset.angle);
    const isAlreadyActive = spoke.classList.contains('active');
    const href = spoke.querySelector('.spoke-label').getAttribute('href');

    console.log('Label clicked:', spoke.dataset.page, 'Already active:', isAlreadyActive);

    // If the clicked spoke is already active, allow default navigation
    if (isAlreadyActive) {
      return; // Allow default navigation
    }

    // Prevent default navigation to handle rotation first
    event.preventDefault();

    // Set the clicked spoke as active immediately
    this.setActiveSpoke(spoke);

    // Rotate the wheel to bring the clicked spoke to the active position
    this.rotateToPosition(currAngle, () => {
      // After rotation animation completes, navigate to the target page
      window.location.href = href;
    });
  }

  // Rotate the wheel to bring the target spoke to the active position
  rotateToPosition(currAngle, callback) {
    // Prevent overlapping rotations
    if (this.isRotating) return;

    this.isRotating = true;

    // Calculate rotation needed to bring current angle to 180 degrees
    const rotationNeeded = 180 - (currAngle % 360);
    this.currentRotation = Math.min(rotationNeeded, 360 - rotationNeeded);

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

  // Set the specified spoke as active
  setActiveSpoke(activeSpoke) {
    // Remove active class from all spokes
    this.spokes.forEach(spoke => spoke.classList.remove('active'));
    
    // Add active class to the target spoke
    activeSpoke.classList.add('active');
  }
}

// Initialize FerrisWheelNavigation when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Log for debugging purposes
  console.log('DOM loaded, initializing navigation...');
  // Create a new instance to set up the navigation wheel
  new FerrisWheelNavigation();
});