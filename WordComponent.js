class WordComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  // Fires when an instance was removed from the document
  disconnectedCallback() {
  }

  get word() {
    return {
      ar: this.getAttribute('ar'),
      en: this.getAttribute('en'),
      for: this.getAttribute('for'),
    };
  }

  set word(newWord) {
    // this.word = newWord;
    this.setAttribute('ar', newWord.ar);
    this.setAttribute('en', newWord.en);
    this.setAttribute('for', newWord.for);
  }

  set setOnClick(newOnClick) {
    this.onClick = newOnClick;
  }

  render() {
    this.innerHTML = `
      <li>
        <div class="en">${this.word.en}
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="19.65283203125 19.875 60.47216796875 60.47216796875" style="enable-background:new 0 0 100 100;" xml:space="preserve"><path d="M78.125,19.875H62.5c-1.1044922,0-2,0.8955078-2,2s0.8955078,2,2,2h10.796875L59.3129883,37.8588867  C54.9671631,34.1691284,49.5148926,32.152832,43.75,32.152832c-6.4365234,0-12.487793,2.5068359-17.0390625,7.0581055  S19.652832,49.8134766,19.652832,56.25s2.5068359,12.487793,7.0581055,17.0390625S37.3134766,80.347168,43.75,80.347168  s12.487793-2.5068359,17.0390625-7.0581055S67.847168,62.6865234,67.847168,56.25  c0-5.7648926-2.0162964-11.2171631-5.7060547-15.5629883L76.125,26.703125V37.5c0,1.1044922,0.8955078,2,2,2s2-0.8955078,2-2V21.875  C80.125,20.7705078,79.2294922,19.875,78.125,19.875z M57.9609375,70.4609375  c-7.8359375,7.8359375-20.5859375,7.8359375-28.421875,0s-7.8359375-20.5859375,0-28.421875  c3.9179688-3.9179688,9.0644531-5.8769531,14.2109375-5.8769531s10.2929688,1.9589844,14.2109375,5.8769531  C65.796875,49.875,65.796875,62.625,57.9609375,70.4609375z"></path></svg>
        </div>
        <div class="ar">${this.word.ar}</div>
      </li>
    `;
  }
}


customElements.define('word-component', WordComponent);

/*
  <div>
      <details>
        <summary>
          <li>
            <div class="en">${this.word.en}<span> ${this.word.for}</span></div>
            <div class="ar">${this.word.ar}</div>
          </li>
        </summary>
        Hello world from Egypt
      </details>
    </div>
*/
/*

// without using a web component
// const renderWords = (words) => {
//   words.forEach(word => {
//     const li = document.createElement('li');
//     const enElement = document.createElement('div');
//     const arElement = document.createElement('div');
//     const forElement = document.createElement('span');
//     enElement.classList.add('en');
//     arElement.classList.add('ar');

//     enElement.textContent = word.en;
//     arElement.textContent = word.ar;
//     forElement.textContent = ` ${word.for}`;

//     enElement.appendChild(forElement);
//     li.appendChild(enElement);
//     li.appendChild(arElement);

//     // li.dataset.sound = word.soundSrc || 'assets/howareyou.mp3'

//     wordsUl.appendChild(li);
//   });
// }

*/