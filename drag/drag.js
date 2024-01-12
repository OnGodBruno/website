const boxes = document.querySelectorAll(".box");
let activeIndex = 6;
let isTransitioning = false;

function updateCurrentImg() {
  isTransitioning = true;

  boxes.forEach((box, index) => {
      const isActive = index === activeIndex;
      box.classList.toggle("expanded", isActive);
      box.classList.toggle("closed", !isActive);

      // Handle the info text visibility
      const infoText = box.querySelector(".info-text");
      if (infoText) {
          if (isActive) {
              infoText.style.opacity = "1";
              infoText.style.visibility = "visible";
          } else {
              infoText.style.opacity = "0";
              infoText.style.visibility = "hidden";
          }
      }
  });

  setTimeout(() => {
      isTransitioning = false;
  }, 500);
}




function handleBoxClick(index) {
  if (isTransitioning) {
      return;
  }

  if (index === activeIndex && boxes[index].classList.contains("expanded")) {
      boxes.forEach((box) => {
          box.classList.remove("closed", "expanded");
          const infoText = box.querySelector(".info-text");
          if (infoText) {
              infoText.style.opacity = "0";
              infoText.style.visibility = "hidden";
          }
      });
      activeIndex = -1; // Reset active index
  } else {
      activeIndex = index;
      updateCurrentImg();
  }
}


updateCurrentImg();

boxes.forEach((box, index) => {
  box.addEventListener("click", () => handleBoxClick(index));
});

boxes.forEach((box) => box.classList.remove("closed", "expanded"));


// Select all .box elements
const boxes2 = document.querySelectorAll('.box');

// Function to handle mouse entering the box
function handleMouseEnter() {
    // Set the z-index of all boxes to 2
    boxes2.forEach(box => {
        box.style.zIndex = '2';
    });

    // Then set the z-index of the hovered box to 3 and scale it
    this.style.transform = 'scale(1.1)';
    this.style.zIndex = '3';
}

// Function to handle mouse leaving the box
function handleMouseLeave() {
    this.style.transform = 'scale(1)';
    // Reset z-index of this box after the transition
    setTimeout(() => {
      if (this.style.transform === 'scale(1)') {
        this.style.zIndex = '1';
      }
      else if (this.style.transform != 'scale(1.1)') {
        this.style.zIndex = '2';
      }
    }, 300); // 300ms matches the transition duration
}

function handleMouseOver() {
  this.style.zIndex = '3';
}

// Add event listeners to each box
boxes2.forEach(box => {
    box.addEventListener('mouseenter', handleMouseEnter);
    box.addEventListener('mouseleave', handleMouseLeave);
    box.addEventListener('mouseover', handleMouseOver);

});
