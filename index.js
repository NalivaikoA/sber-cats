const $wr = document.querySelector('[data-wr]')

const getCreateCatFormHtml = () => `                <p>Добавить нового кота</p>
<form id="form" name="createCatForm">
    <label for="id">ID кота</label>
    <input required type="number" placeholder="ID кота" name="id">

    <label for="name">Имя кота</label>
    <input required type="text" placeholder="Имя кота" name="name">

    <label for="rate">Рейтинг кота</label>
    <input type="number" placeholder="Введите число от 0 до 10" name="rate" min="0" max="10">

    <label for="age">Возраст</label>
    <input type="number" placeholder="Введите число" name="age" min="0" max="99">

    <label for="description">Описание кота</label>
    <input type="text" placeholder="Описание кота" name="description">

    <label for="form_image">Фотография кота</label>
    <input type="text" placeholder="Добавьте ссылку на фотографию" name="image">

    <label for="favorite">Любимец?</label>
    <select name="favorite">
        <option value="true">Да</option>
        <option value="false">Нет</option>
    </select>

    <button type="submit" class="form__submit">Отправить данные</button>

    <div class="pop_up_close" id="pop_up_close">
        <i class="fa-solid fa-circle-xmark"></i>
    </div>
</form>`

const getEditCatFormHtml = () => `                <p>Редактировать кота</p>
<form id="form_edit" name="createCatForm">
    <label for="id">ID кота</label>
    <input readonly required type="number" placeholder="ID кота" name="id">

    <label for="name">Имя кота</label>
    <input readonly required type="text" placeholder="Имя кота" name="name">

    <label for="rate">Рейтинг кота</label>
    <input type="number" placeholder="Введите число от 0 до 10" name="rate" min="0" max="10">

    <label for="age">Возраст</label>
    <input type="number" placeholder="Введите число" name="age" min="0" max="99">

    <label for="description">Описание кота</label>
    <input type="text" placeholder="Описание кота" name="description">

    <label for="form_image">Фотография кота</label>
    <input type="text" placeholder="Добавьте ссылку на фотографию" name="image">

    <label for="favorite">Любимец?</label>
    <select name="favorite">
        <option value="true">Да</option>
        <option value="false">Нет</option>
    </select>

    <button type="submit" class="form__submit">Отправить данные</button>

    <div class="pop_up_close" id="pop_up_close_edit">
        <i class="fa-solid fa-circle-xmark"></i>
    </div>
</form>`

const PopUp = document.getElementById('pop_up')
const PopUpBody = document.getElementById('pop_up_body')

const actions_detail = 'detail'
const actions_delete = 'delete'
const actions_edit = 'edit'

const CREATE_FORM_LS_KEY = 'CREATE_FORM_LS_KEY'

const getCatHTML = (cat) => `
        <div data-cat-id="${cat.id}" class="card">
            <div class="image__body">
            <img src="${cat.image}" class="card__image" alt="${cat.name}" />
            </div>
            <div class="card__body">
                <h3>${cat.name}</h3> 
                <p>${cat.description}</p>
            </div>
            <div class="card__button">
                <button data-edit data-openModal="editCat" data-action="${actions_edit}">Изменить</button>
                <button data-detail data-openModal="detail" data-action="${actions_detail}">Подробнее</button>
                <button class="button_delete" data-action="${actions_delete}">Удалить</button>
            </div>
        </div>
	`

const getCatHTMLdetail = (cat) => `
    <div data-cat-id="${cat.id}" class="card_detail">
    <img src="${cat.image}" class="card__image" alt="${cat.name}" />
    <div class="card__body">
        <h2>Имя: ${cat.name}</h2> 
        <p>ID: ${cat.id}</p>
        <p>Возраст: ${cat.age}</p>
        <p>Описание: ${cat.description}</p>
        <p>Рейтинг: ${cat.rate}</p>
        <p id="catFavorite">${cat.favorite}</p>
    </div>
</div>
	`

fetch('https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/show/')
  .then((resolve) => resolve.json())
  .then((data) => {
    $wr.insertAdjacentHTML('afterbegin', data.map((cat) => getCatHTML(cat)).join(''))

    console.log({ data })
  })

// Удаление кота

$wr.addEventListener('click', (e) => {
  if (e.target.dataset.action === actions_delete) {
    console.log(e.target)

    const $catWr = e.target.closest('[data-cat-id]')
    const catId = $catWr.dataset.catId

    console.log({ catId })

    fetch(`https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/delete/${catId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.status === 200) {
        return $catWr.remove()
      }
      alert(`Удаление кота с id = ${catId} не удалось`)
    })
  }
})

// Добавление кота

const formatCreateFormData = (formData) => ({
  ...formData,
  id: +formData.id,
  rate: +formData.rate,
  age: +formData.age,
  favorite: JSON.parse(formData.favorite),
})

const submitCreateCatHandler = (e) => {
  e.preventDefault()

  const formData = formatCreateFormData(Object.fromEntries(new FormData(e.target).entries()))

  console.log(formData)

  fetch('https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/add/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }).then((res) => {
    if (res.status === 200) {
      localStorage.clear()
      PopUp.classList.remove('active')
      PopUpBody.innerHTML = ''
      return $wr.insertAdjacentHTML('afterbegin', getCatHTML(formData))
    }
    throw Error('Ошибка при создании кота')
  }).catch(() => alert('Ошибка при создании кота'))
}

const openModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'createCat') {
    PopUpBody.insertAdjacentHTML('afterbegin', getCreateCatFormHtml())
    const $createCatForm = document.querySelector('#form')
    const dataFromLS = localStorage.getItem(CREATE_FORM_LS_KEY)

    const preparedDataFromLS = dataFromLS && JSON.parse(dataFromLS)

    if (preparedDataFromLS) {
      Object.keys(preparedDataFromLS).forEach((key) => {
        $createCatForm[key].value = preparedDataFromLS[key]
      })
    }

    const closePopUp = document.getElementById('pop_up_close')
    PopUp.classList.add('active')

    $createCatForm.addEventListener('submit', submitCreateCatHandler)

    closePopUp.addEventListener('click', () => {
      PopUp.classList.remove('active')
      PopUpBody.innerHTML = ''
    })
    $createCatForm.addEventListener('change', () => {
      const formattedData = formatCreateFormData(
        Object.fromEntries(new FormData($createCatForm).entries()),
      )

      localStorage.setItem(CREATE_FORM_LS_KEY, JSON.stringify(formattedData))
    })
  }
}

document.addEventListener('click', openModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    PopUp.classList.remove('active')
    PopUpBody.innerHTML = ''
  }
})

// Добавляю детальную информацию про кота

const PopUpDetail = document.getElementById('pop_up_detail')
const PopUpBodyDetail = document.getElementById('pop_up_body_detail')
const $modalWr = document.querySelector('[data-modalWr]')

const openModalHandlerDetail = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'detail') {
    PopUpDetail.classList.add('active')
  }
}

document.addEventListener('click', openModalHandlerDetail)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    PopUpDetail.classList.remove('active')
    PopUpBodyDetail.innerHTML = ''
  }
})

document.addEventListener('click', (e) => {
  if (e.target === $modalWr) {
    PopUpDetail.classList.remove('active')
    PopUpBodyDetail.innerHTML = ''
  }
})

$wr.addEventListener('click', (e) => {
  if (e.target.dataset.action === actions_detail) {
    const $catWr = e.target.closest('[data-cat-id]')
    const catId = $catWr.dataset.catId

    console.log({ catId })

    fetch(`https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/show/${catId}`)
      .then((resolve) => resolve.json())
      .then((cat) => {
        PopUpBodyDetail.insertAdjacentHTML('afterbegin', getCatHTMLdetail(cat))

        const catFavorite = document.getElementById('catFavorite')
        if (catFavorite.innerHTML === 'true') {
          catFavorite.innerHTML = 'Любимый кот: Да'
        } else { catFavorite.innerHTML = 'Любимый кот: Нет' }
      })
  }
})

// Редактирование кота

const openPopUpEdit = document.querySelector('[data-edit]')
console.log(openPopUpEdit)
const PopUpEdit = document.getElementById('pop_up_edit')
console.log(PopUpEdit)
const PopUpBodyEdit = document.getElementById('pop_up_body_edit')
console.log(PopUpBodyEdit)

const openEditModalHandler = (e) => {
  const targetModalName = e.target.dataset.openmodal

  if (targetModalName === 'editCat') {
    PopUpBodyEdit.insertAdjacentHTML('afterbegin', getEditCatFormHtml())
    const $createCatFormEdit = document.querySelector('#form_edit')

    const closePopUpEdit = document.getElementById('pop_up_close_edit')
    PopUpEdit.classList.add('active')

    const $catWr = e.target.closest('[data-cat-id]')
    const catId = $catWr.dataset.catId

    const submitEditCatHandler = (ev) => {
      ev.preventDefault()

      const formDataEdit = formatCreateFormData(
        Object.fromEntries(new FormData(ev.target).entries()),
      )

      console.log(formDataEdit)

      fetch(`https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/update/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataEdit),
      }).then((res) => {
        if (res.status === 200) {
          PopUpEdit.classList.remove('active')
          PopUpBodyEdit.innerHTML = ''
          document.querySelector(`[data-cat-id="${catId}"]`).remove()
          return $wr.insertAdjacentHTML('afterbegin', getCatHTML(formDataEdit))
        }
        throw Error('Ошибка при создании кота')
      }).catch(() => alert('Ошибка при создании кота'))
    }

    $createCatFormEdit.addEventListener('submit', submitEditCatHandler)

    closePopUpEdit.addEventListener('click', () => {
      PopUpEdit.classList.remove('active')
      PopUpBodyEdit.innerHTML = ''
    })

    console.log({ catId })

    fetch(`https://cats.petiteweb.dev/api/single/AleksN-Frontend-9/show/${catId}`)
      .then((resolve) => resolve.json())
      .then((data) => {
        Object.keys(data).forEach((key) => {
          $createCatFormEdit[key].value = data[key]
        })
      })
  }
}

document.addEventListener('click', openEditModalHandler)

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    PopUpEdit.classList.remove('active')
    PopUpBodyEdit.innerHTML = ''
  }
})
