const skipRegex = /\blink\b|\bscript\b/;

const handle = (el) => {
	const $el = $(el);
	const name = $el.prop("tagName");
  if (skipRegex.test(name)){
  	return;
  }
  
	$(el).children().each((i, kid) => {
  	handle(el);
  });
	if (name === "BODY"){
  	return;
  }
  
  // parse
  const text = el.childNodes.every(e => e.nodeType === 3)
  	? el.childNodes[0].nodeValue
    : undefined;
  const classNames = el.classList.value.replace(/\s+/g,' ').trim().split(' ');
  const outerHTML = el.outerHTML;
  
};