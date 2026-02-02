document.addEventListener('DOMContentLoaded', function (){
    let queryObj = parseQueryString()
    let showTxtBtn = document.querySelector('.show-txt')
    let tagListBlock = document.querySelector('.vacancies-group-list')
    if (showTxtBtn){
        let fullTxtTemplateBlock = document.querySelector('.txt template.full')
        let thumbTxtTemplateBlock = document.querySelector('.txt template.thumb')
        let txtBlock = document.querySelector('.txt_content')
        showTxtBtn.addEventListener('click', function (){
            if (fullTxtTemplateBlock.classList.contains('active')){
                fullTxtTemplateBlock.classList.remove('active')
                thumbTxtTemplateBlock.classList.add('active')
                let template = thumbTxtTemplateBlock.content.cloneNode(true)
                txtBlock.replaceChildren()
                txtBlock.appendChild(template)
            } else {
                fullTxtTemplateBlock.classList.add('active')
                thumbTxtTemplateBlock.classList.remove('active')
                let template = fullTxtTemplateBlock.content.cloneNode(true)
                txtBlock.replaceChildren()
                txtBlock.appendChild(template)
            }
        })
    }
    if (tagListBlock){
        tagListBlock.addEventListener('click', function (event){
            let elem = event.target
            let value = elem.getAttribute('data-id')

            if (elem.classList.contains('vacancies-group') && value){
                if (queryObj['tags'] && queryObj['tags']===value){
                    delete queryObj['tags']
                } else {
                    queryObj['tags'] = value
                }
                /*if (queryObj['tags']){
                    let tagSet = queryObj['tags'].split(',')
                    let valueIndex  = tagSet.indexOf(value)
                    if (valueIndex>=0){
                        tagSet.splice(valueIndex, 1)
                    } else {
                        tagSet.push(value)
                    }
                    if (tagSet.length>0) {
                        queryObj['tags'] = tagSet.join(',')
                    } else {
                        delete queryObj['tags']
                    }
                } else {
                    queryObj['tags'] = value
                }*/
                window.location = buildUrl()
            }
        })
    }

    function parseQueryString() {
        if (!window.location.search){
            return {};
        }

        const result = {};
        window.location.search.replace(/^\?/, '').split('&').forEach(param => {
            const [key, value] = param.split('=');
            if (key){
                // Проверяем, является ли ключ вложенным (формат [ключ])
                const match = key.match(/(.+)\[(.+)\]/);

                if (match) {
                    const [, parentKey, childKey] = match;
                    result[parentKey] = result[parentKey] || {};
                    // Преобразование в число, если это возможно
                    result[parentKey][childKey] = isNaN(value) ? value : Number(value);
                } else {
                    result[key] = value
                }
            }
        });

        return result;
    }

    function buildUrl(){
        let queryArr = [];
        for (let queryKey in queryObj){
            if (queryObj[queryKey]){
                if (typeof queryObj[queryKey]==='object'){
                    if (Array.isArray(queryObj[queryKey])){
                        queryArr.push(queryKey+`=`+queryObj[queryKey].join('.'))
                    } else {
                        for(let key in queryObj[queryKey]){
                            queryArr.push(queryKey+`[${key}]=`+queryObj[queryKey][key])
                        }
                    }
                } else {
                    queryArr.push(queryKey+'='+queryObj[queryKey])
                }
            } else {
                queryArr.push(queryKey)
            }
        }
        return window.location.pathname+(queryArr.length>0 ? '?'+queryArr.join('&') : '')
    }
})