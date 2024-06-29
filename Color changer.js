window.addEventListener('DOMContentLoaded', function() {
  let colorList = document.querySelector('.color-changer-list');
  let editBtns = [];

  if (colorList !== null) {
    // DODAJ NOWY ROK
    let addNew = document.querySelector('.color-changer-btn-add');

    addNew.addEventListener('click', function() {
      let newYearContainer = document.createElement('div');

      newYearContainer.classList.add('color-changer-year-container');
      // JAK WYGLĄDA KONTENER NOWEGO ROKU
      newYearContainer.innerHTML = `
                <div class="color-changer-number"><input type="number" value="2024"></div>
                <div class="color-changer-picker"><input type="color" value="#FFBE98" colorpick-eyedropper-active="false"></div>
                <div class="color-changer-action check"><i class="fas fa-check"></i><p class="color-changer-remove">x</p></div>
            `;
      // --//
      colorList.appendChild(newYearContainer);
      addFunctionality(newYearContainer, editBtns);
    });

    // WCZYTAJ DANE Z BAZY I WYŚWIETL NA STRONIE
    let colorsData = document.querySelectorAll('.color-changer-chosen-year');

    colorsData.forEach(color => {
      let loadedYearContainer = document.createElement('div');

      loadedYearContainer.classList.add('color-changer-year-container');
      // JAK WYGLĄDA KONTENER WCZYTANEGO BLOKU
      loadedYearContainer.innerHTML = `
                <div class="color-changer-number"><input type="number" value="${color.dataset.year}" disabled="disabled"></div>
                <div class="color-changer-picker"><input type="color" value="${color.dataset.color}" colorpick-eyedropper-active="false" disabled="disabled"></div>
                <div class="color-changer-action check"><i class="fas fa-edit"></i><p style="display:none;" class="color-changer-remove">x</p></div>
            `;
      // --//
      colorList.appendChild(loadedYearContainer);
      addFunctionality(loadedYearContainer, editBtns);
    });
  }

  //USTAWIANIE ZAINSTALOWANYCH KOLORÓW NA STRONIE
  let registeredColors = document.querySelectorAll('.color-changer-database .color-changer-chosen-year');
  if(registeredColors !== null){
    registeredColors.forEach(color => {
      let selectedColor = color.dataset.color;
      let selectedYear = color.dataset.year;
      console.log('color',selectedColor);
      console.log('year',selectedYear);

      //ZŁAP ELEMENTY
      const coloredElements = document.querySelectorAll(`
				div[class*="term"][class*="${selectedYear}"] .annual-bg,
				.annual-bg div[class*="term"][class*="${selectedYear}"] > div,
				article[class*="post"][class*="${selectedYear}"] .annual-bg,
				article[class*="post"][class*="${selectedYear}"] > div,
				body.single-post[class*="${selectedYear}"] .article-pin-ico:after,
				body.single-post[class*="${selectedYear}"] .article-timer-ico:after,
				body.single-post[class*="${selectedYear}"] .annual-bg,
				body.single-post[class*="${selectedYear}"] .zeno_font_resizer a,
				body.single-post[class*="${selectedYear}"] .post_content p:first-of-type:first-letter,
				body.single-post[class*="${selectedYear}"] .article-navigation-wrapper,
				body.single-post[class*="${selectedYear}"] h4
			`);

      //ZMIEŃ KOLORY
      console.log('coloredElements',coloredElements.length);
      if(coloredElements.length !== 0){
        coloredElements.forEach(element =>{
          element.style.backgroundColor = selectedColor;
          element.style.color = selectedColor;
          element.style.borderColor = selectedColor;
        });
      }

      //WYJĄTEK DLA PSEUDOELEMENTÓW:
      const style = document.createElement('style');
      style.innerHTML = `
				body.single-post[class*="${selectedYear}"] .article-pin-ico:after,
				body.single-post[class*="${selectedYear}"] .article-timer-ico:after {
					background-color: ${selectedColor};
					color: ${selectedColor};
					border-color: ${selectedColor};
				}
				body.single-post[class*="${selectedYear}"] .post_content p:first-of-type:first-letter {
					color: ${selectedColor};
				}
			`;
      document.head.appendChild(style);
    });
  }
});

// FUNKCJE PRZYCISKÓW
function addFunctionality(itemContainer, editBtns) {
  // DODAJ EDIT/ZATWIERDŹ DO BTN
  let curBtn = itemContainer.querySelector('.color-changer-action > i');
  let curBtnRemove = itemContainer.querySelector('.color-changer-action > p');
  let curNumber = itemContainer.querySelector('.color-changer-number > input');
  let curColor = itemContainer.querySelector('.color-changer-picker > input');
  editBtns.push(curBtn);

  curBtn.addEventListener('click', function() {
    if (curBtn.classList.contains('fa-check')) {
      // ZABLOKUJ I ZMIEŃ IKONĘ
      curNumber.setAttribute('disabled', 'disabled');
      curColor.setAttribute('disabled', 'disabled');
      curBtn.classList.remove('fa-check');
      curBtn.classList.add('fa-edit');
      curBtnRemove.style.display = 'none';

      // WYŚLIJ DANE
      saveNewYear(curNumber.value, curColor.value);
    } else {
      // ODBLOKUJ I ZMIEŃ IKONĘ
      curNumber.removeAttribute('disabled');
      curColor.removeAttribute('disabled');
      curBtn.classList.remove('fa-edit');
      curBtn.classList.add('fa-check');
      curBtnRemove.style.display = 'flex';
    }
  });

  // USUŃ ROK
  curBtnRemove.addEventListener('click', function() {
    itemContainer.remove();
    deleteYear(curNumber.value);
  });
}

// WYŚLIJ DANE NA SERWER
function saveNewYear(year, color) {
  console.log(year, color);
  jQuery.ajax({
    url: colorChanger.ajax_url,
    type: 'POST',
    data: {
      action: 'save_new_year',
      year: year,
      color: color,
    },
    success: function(response) {
      console.log('Dane zostały zapisane: ', response);
    },
    error: function(xhr, status, error) {
      console.log('Wystąpił błąd: ', error);
    }
  });
}

//USUŃ DANĄ Z SERWERA
function deleteYear(year){
  console.log('Usuwanie roku: ',year);
  jQuery.ajax({
    url: colorChanger.ajax_url,
    type: 'POST',
    data: {
      action: 'delete_year',
      year: year
    },
    success: function(response){
      console.log('Dane zostały usunięte: ', response);
    },
    error:function(xhr, status, error) {
      console.log('Wystąpił błąd: ', error);
    }
  });
}
