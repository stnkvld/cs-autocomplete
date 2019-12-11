'use strict';

;!function(xhrUrl) {
	const localStorageVar = '_itemList';
	const autocomplete = document.querySelector('.autocomplete');
	const autocompleteLine = autocomplete.querySelector('.autocomplete__input');
	const autocompleteTemplate = document.getElementById('autocomplete__template-item');
	const autocompleteTemplateEmpty = document.getElementById('autocomplete__null-result');
	const autocompleteUl = autocomplete.querySelector('.autocomplete__list');
	let autocompleteEmpty;

	const xhr = new XMLHttpRequest();
    xhr.open('GET', xhrUrl, true);
    xhr.send(null);

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            init(xhr);
        }
	}
	
	const init = ajax => {
		try {
			let itemList;
			if (ajax){
				itemList = JSON.parse(ajax.response);
				localStorage.setItem(localStorageVar, ajax.response);
			} else {
				itemList = JSON.parse(localStorage.getItem(localStorageVar));
			}

			autocompleteUl.innerHTML = '';
			for (let i=0; i < itemList.length; ++i) {
				const autocompleteItem = autocompleteTemplate.content.cloneNode(true);
				const label = autocompleteItem.querySelector('.autocomplete__label');
				const input = autocompleteItem.querySelector('.autocomplete__radio');

				input.id = `ac-${i}`;
				label.setAttribute('for', input.id);
				input.value = itemList[i];
				label.innerText = itemList[i];

				label.addEventListener('click', function() {
					autocompleteLine.value = input.value;
					autocompleteLine.dispatchEvent(new Event('input'));
				});
		
				input.addEventListener('keyup', function(evt) {
					if (evt.code === 'Enter') {
						autocompleteLine.value = input.value;
						autocompleteLine.dispatchEvent(new Event('input'));
					}
				});

				input.addEventListener('focus', function(event) {
					autocompleteUl.classList.add('autocomplete__list--show');
					this.checked = true;
				});
				
				input.addEventListener('blur', function(event) {
					if (event.relatedTarget && !event.relatedTarget.classList.contains('autocomplete__radio')) {
						autocompleteUl.classList.remove('autocomplete__list--show');
					}
				});

				autocompleteUl.appendChild(autocompleteItem);
			}
			autocompleteUl.appendChild(autocompleteTemplateEmpty.content.cloneNode(true));
			autocompleteEmpty = autocompleteUl.querySelector('.autocomplete__list-item:last-child');

			autocompleteLine.addEventListener('input', function() {
				let searchStr = this.value;
		
				autocompleteUl.querySelectorAll('.autocomplete__radio').forEach(item => {
					if (~item.value.toLowerCase().indexOf(searchStr.toLowerCase())) {
						let regExp = new RegExp(searchStr, 'i');
						let result = item.value.match(regExp)[0];
						item.parentNode.querySelector('.autocomplete__label').innerHTML = item.value.replace(regExp, `<b>${result}</b>`);
						item.parentNode.classList.remove('autocomplete__list-item--hide');
					} else {
						item.parentNode.classList.add('autocomplete__list-item--hide');
					}
				});

				let test = autocompleteUl.querySelector('.autocomplete__list-item:not(.autocomplete__list-item--hide):not(:last-child)');
				if (!test)
					autocompleteEmpty.classList.remove('autocomplete__list-item--hide');
				else
					autocompleteEmpty.classList.add('autocomplete__list-item--hide');
			});

			autocompleteLine.addEventListener('focus', function() {
				const checkedItem = autocompleteUl.querySelector('.autocomplete__radio:checked');
				if (checkedItem) checkedItem.checked = false;
			});

			autocompleteLine.addEventListener('blur', function(event) {
				if (event.relatedTarget && !event.relatedTarget.classList.contains('autocomplete__radio')) {
					autocompleteUl.classList.remove('autocomplete__list--show');
				}
			});
		} catch (e) {
			if (ajax){
				console.error("Unknown response type: " + e.message);
			} else {
				console.error("Local data was corrupted: " + e.message);
			}
		}
	}
}('/list.json');