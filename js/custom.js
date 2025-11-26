// aos animation
  AOS.init({
    duration:1000,
      once: true
    });  
     
  document.addEventListener('DOMContentLoaded', () => {
  // BIM calculation

  const bmiForm = document.getElementById("bmiForm");
  const resultDiv = document.getElementById("bmiResult");

  if (bmiForm) {
    bmiForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const weight = parseFloat(document.getElementById("weight").value);
      const height = parseFloat(document.getElementById("height").value);
      const age = parseInt(document.getElementById("age").value);
      var gender = document.getElementsByName('gender');
              for (i = 0; i < gender.length; i++) {
                  if (gender[i].checked){
                      var genderValue = gender[i].value;
                  }
              }
      if (!weight || !height || !age || !genderValue) {
        resultDiv.innerText = "Please fill all fields correctly.";
        return;
      }

      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      const category = getBMICategory(bmi);

      const bodyFat = estimateBodyFat(bmi, age, genderValue);

      resultDiv.innerHTML = `
        Your BMI is <strong>${bmi.toFixed(2)}</strong> (${category})<br />
        Estimated Body Fat: <strong>${bodyFat}%</strong>
      `;
    });
  }
  function getBMICategory(bmi) {
    if (bmi < 18.5) return "Underweight";
    else if (bmi < 24.9) return "Normal weight";
    else if (bmi < 29.9) return "Overweight";
    else return "Obese";
  }

  function estimateBodyFat(bmi, age, genderValue) {
    if (genderValue === "male") {
      return (1.20 * bmi + 0.23 * age - 16.2).toFixed(2);
    } else if (genderValue === "female") {
      return (1.20 * bmi + 0.23 * age - 5.4).toFixed(2);
    } else {
      return "N/A";
    }
  }

  
  // back to top 
  const backToTopBtn = document.getElementById("backToTop");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");


  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }

    // add class active on scroll
    let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const headerHeight = document.querySelector('header').offsetHeight;

    if (pageYOffset >= sectionTop - headerHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // schedule data
  const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDNjzlDjF7fcZmjOBKNMuTj9iRI8Qb0R0dnkL7D2SnihP658i1IgtRtLXAWjfgCmwku8w8SdCPJ1Jc/pub?output=csv";

    fetch(sheetURL)
      .then(response => response.text())
      .then(data => {
        const rows = data.trim().split('\n').map(row => row.split(','));
        const table = document.getElementById('gym-table');

        rows.forEach((row, rowIndex) => {
          const tr = document.createElement('tr');
          row.forEach(cell => {
            const cellEl = document.createElement(rowIndex === 0 ? 'th' : 'td');
 //<img src="${image.trim()}" alt="${text.trim()}"></img>
            // Check if cell contains text + image
            if (cell.includes('|')) {
              const [text,name] = cell.split('|');
              cellEl.innerHTML = `
                <div class="cell-content">
                  <h4>${text.trim()}</h4>     
                  <span>${name.trim()}</span>         
                </div>
              `;

            } else {
              cellEl.textContent = cell.trim();
            }

            tr.appendChild(cellEl);
          });
          table.appendChild(tr);
        });
      });


  // click on header menu
  const headerHeight = document.querySelector('header').offsetHeight;
    const links = document.querySelectorAll('.navbar-nav .nav-link, .btn-reach');

    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
        
        const activeItem = document.querySelector('.navbar-nav .nav-link.active');
        if (activeItem) {
            activeItem.classList.remove('active');
        }
        link.classList.add("active");
        document.getElementById("navbarSupportedContent").classList.remove("show");
        document.getElementById("navbarToggle").classList.add("collapsed");
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });     
}); // end of load function