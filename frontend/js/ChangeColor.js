const filter = document.getElementById('paper_results');
let key = filter.innerText.replace(/^"(.*)"$/, '$1');
// console.log(key)
if (key){
    const paragraphs = document.querySelectorAll('p');
    const keyword = key; //测试用利于更改字符串查看效果

    for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        const text = paragraph.innerHTML;

        // 创建一个新的框去替代原来的
        const div = document.createElement('div');

        let currentIndex = 0;
        let lastIndex = 0;

        while ((currentIndex = text.indexOf(keyword, lastIndex)) !== -1) {
            // 添加关键词之前的内容，保持原有不变
            div.appendChild(document.createTextNode(text.substring(lastIndex, currentIndex)));

            // 创建span元素来包裹keyword
            const span = document.createElement('span');
            span.classList.add('highlighted-text');
            span.textContent = keyword;
            div.appendChild(span);

            lastIndex = currentIndex + keyword.length;
        }

        // 添加剩余的文本内容，保持一个text前后都不变
        div.appendChild(document.createTextNode(text.substring(lastIndex)));
        paragraph.innerHTML = div.innerHTML;
    }
}
else {
console.log('功能失效');

}