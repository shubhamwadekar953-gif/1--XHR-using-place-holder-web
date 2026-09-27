var cl = console.log;

const postForm = document.getElementById('postForm')
const postList = document.getElementById('postList')
const title = document.getElementById('title')
const content = document.getElementById('content')
const addBtn = document.getElementById('addBtn')
const updateBtn = document.getElementById('updateBtn')

const BASE_URL = `https://jsonplaceholder.typicode.com`
const POST_URL = `${BASE_URL}/posts`

// read-post//
let xhr = new XMLHttpRequest();
xhr.open("GET", POST_URL, true)
xhr.send()
xhr.onload = function () {
    let postdata = JSON.parse(xhr.response)
    let result = ``;
    postdata.forEach(posts => {
        result += `   <div class="col-md-4 mb-5" id="${posts.id}">
                    <div class="card h-100">
                        <div class="card-header">
                            <h4>${posts.title}</h4>
                        </div>
                        <div class="card-body">
                            <p>${posts.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick="editpost(this)" class="btn btn-sm btn-primary" type="button">edit</button>
                            <button onclick="deletepost(this)" class="btn btn-sm btn-danger" type="button">remove</button>
                        </div>
                    </div>
                </div>`;
    });
    postList.innerHTML = result;
}

//create-post//
function oncrteatepost(ele) {
    ele.preventDefault();
    createobj = {
        title: title.value,
        body: content.value,
        userId: 1
    }

    let xhr = new XMLHttpRequest()
    xhr.open('POST', `${BASE_URL}/posts`)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhr.send(JSON.stringify(createobj))
    xhr.onload = function () {
        if (xhr.status === 201) {
            let res = JSON.parse(xhr.response)
            let col = document.createElement('div')
            col.className = `col-md-4 mb-5`;
            col.id = res.id || Date.now();
            cl(col)
            col.innerHTML = `<div class="card h-100">
                        <div class="card-header">
                            <h4>${createobj.title}</h4>
                        </div>
                        <div class="card-body">
                            <p>${createobj.body}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button onclick="editpost(this)"  class="btn btn-sm btn-primary" type="button">edit</button>
                            <button onclick="deletepost(this)" class="btn btn-sm btn-danger" type="button">remove</button>
                        </div>
                    </div>`;
            postList.prepend(col)
            postForm.reset()

            Swal.fire({
                title: "Your Post Card Created Successfully..!",
                icon: "success",
                timer: 1500
            });
        } else {
            cl(`somthing want wrong..?`)
        }
    }
}

//edit
function editpost(ele) {
    let edit_id = ele.closest('.col-md-4').id;
    localStorage.setItem('EDIT_ID', edit_id)
    let card = ele.closest('.col-md-4')
    title.value = card.querySelector('.card-header h4').innerText;
    content.value = card.querySelector('.card-body p').innerText;

    addBtn.classList.add('d-none')
    updateBtn.classList.remove('d-none')
}

//update
function onupdatepost(e) {
    if(e) e.preventDefault();
    let update_id = localStorage.getItem('EDIT_ID')
    let update_obj = {
        title: title.value,
        body: content.value,
        userId: 1,
    }
    let update_url = `${BASE_URL}/posts/${update_id}`
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", update_url)
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8")
    xhr.send(JSON.stringify(update_obj));
    xhr.onload = function () {
        if (xhr.status == 200) {
            let col = document.getElementById(update_id);
            let h4 = col.querySelector('.card-header h4');
            let p = col.querySelector('.card-body p')
            h4.innerHTML = update_obj.title;
            p.innerHTML = update_obj.body;

            updateBtn.classList.add('d-none')
            addBtn.classList.remove('d-none');
            postForm.reset()
            localStorage.removeItem('EDIT_ID')

            Swal.fire({
                title: "Your POST Card Updated Successfully..!",
                icon: "success",
                timer: 1500
            });
        }
    }
}

//delete
function deletepost(ele) {
    let delete_id = ele.closest('.col-md-4').id;

    Swal.fire({
        title: "Are You Sure You Want To delete This Post Card?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let remove_url = `${BASE_URL}/posts/${delete_id}`
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', remove_url)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status == 200) {
                    ele.closest('.col-md-4').remove()
                }
            }
            Swal.fire({
                title: "Your Post Card Deleted Successfully!",
                icon: "success",
                timer: 1500
            });
        }
    });
}
postForm.addEventListener('submit', oncrteatepost)
updateBtn.addEventListener('click', onupdatepost);