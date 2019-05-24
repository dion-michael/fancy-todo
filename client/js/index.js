
$(document).ready(function(){
    init()
    if(checkSignedIn()){
        showApp()
        M.toast({html: `Welcome back, ${localStorage.getItem("name")}`})
    }else{
        hideApp()
    }
});

var elems2 = document.querySelectorAll('.chips');
var instances = M.Chips.init(elems2, {
    placeholder: "Add new Task",
    secondaryPlaceholder: "Press enter to add another task"
});

$("#todoForm").submit(function(event){
    event.preventDefault()
    let title = $('#todo-title').val()
    let deadline = $('#todo-deadline').val()
    let tasks = M.Chips.getInstance($(".chips")).chipsData
    let arrOfTasks = []
    tasks.forEach(task => {
        arrOfTasks.push(task.tag)
    })
    let stroftask = (JSON.stringify(arrOfTasks))
    $.ajax({
        url: `http://104.154.192.253:3000/todo`,
        method: "POST",
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            user_id     : localStorage.getItem("id"),
            title       : title,
            deadline    : deadline,
            tasks       : stroftask,
            status      : false
        }
    }).done(savedData => {
        populate()
    }).fail(err=>{
    })
})


function init(){

    $('.sidenav').sidenav();
    $('.tooltipped').tooltip();
    $('.collapsible').collapsible();

    var elems = document.querySelectorAll('.dropdown-trigger');
    var instances = M.Dropdown.init(elems, {
        closeOnClick: true,
        coverTrigger: false, 
        hover: true,
        constrainWidth: false,
    });

    var elemsCal = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elemsCal, {
        minDate: new Date()
    });

    $('.modal').modal();

    $('.modal').on('hidden', function() {
        $('.modal[type=input]').val('');
      });

    $(".item").find("input[type=checkbox]").on("change",function() {
        var status = $(this).prop('checked')
        $("#submit-change-btn").show()
    });

    $(".btn-cancel-change").click(function(){
        $('#submit-change-btn').hide()
    })

    $( "#create-account-text" ).click(function() {
        $('#create-account-text').hide()
        $('#signin-account-text').show()
        $('#log-form').hide()
        $('#reg-form').show()
        $('.login-title').html('Get started by creating an account')
    });

    $( "#signin-account-text" ).click(function() {
        $('#signin-account-text').hide()
        $('#create-account-text').show()
        $('#reg-form').hide()
        $('#log-form').show()
        $('.login-title').html('Please, login into your account')
    });

    $( "#reg-form" ).submit(function( event ) {
        let name = $('#reg-form #name').val()
        let email = $('#reg-form #email').val()
        let password = $('#reg-form #password').val()
        registerEmail(name, email, password)
        event.preventDefault();
    });

    $( "#log-form" ).submit(function( event ) {
        event.preventDefault();
        let email = $('#log-form #email').val()
        let password = $('#log-form #password').val()
        signInByEmail(email, password)
    });

    $('#deleteTodo').click((event)=>{
        event.preventDefault()
        let todoId = $(this).attr('todoId')
        deleteTodo(todoId)
    })

}

function signInByEmail(email, password){
    
    $.ajax({
        url: `http://104.154.192.253:3000/user/emailSignIn`,
        method: "POST",
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            email,
            password
        }
    }).done(userData => {
        alert('masuk')
        localStorage.setItem('token', userData.token)
        localStorage.setItem('id', userData.id)
        localStorage.setItem('name', userData.name)
        localStorage.setItem('email', userData.email)
        localStorage.setItem('todos', userData.todos)
        localStorage.setItem('picture', userData.picture)
        showApp()
        M.toast({html: `Welcome, ${localStorage.getItem("name")}`})
    })
}

function registerEmail(name, email, password){
    $.ajax({
        url: `http://104.154.192.253:3000/user`,
        method: "POST",
        headers: {
            token: localStorage.getItem("token")
        },
        data: {
            name, 
            email,
            password,
            isGoogle: false
        }
    }).done(userData => {
        localStorage.setItem('token', userData.token)
        localStorage.setItem('id', userData.id)
        localStorage.setItem('name', userData.name)
        localStorage.setItem('email', userData.email)
        localStorage.setItem('todos', userData.todos)
        localStorage.setItem('picture', userData.picture)
        showApp()
        M.toast({html: `Welcome, ${localStorage.getItem("name")}`})
    })
}

function confirmSignOut(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You have to sign in to use flaTodo!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, bye!'
    }).then((result) => {
        if (result.value) {
            signOut()
        }
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    });
    localStorage.removeItem('token')
    localStorage.removeItem('id')
    localStorage.removeItem('name')
    localStorage.removeItem('email')
    localStorage.removeItem('todos')
    localStorage.removeItem('picture')
    hideApp()
    M.toast({html: `See you again`})
}

function checkSignedIn(){
    
    if (localStorage.getItem('token')) {
        return true
    }
    else{
        return false
    }
}

function hideApp(){
    $('#login-form').show()
    $('#user-todos').hide()
    $('.profile-picture').hide()
    $('.nav-links').addClass("hide")
}

function showApp(){
    $('#login-form').hide()
    $('#user-todos').show()
    $('.profile-picture').show()
    populate()
}

function populate(){
    if(localStorage.getItem("picture") !== 'undefined'){
        $('.profile-picture').attr("src", localStorage.getItem("picture"))
    }
    $('#sidenav-name').html(localStorage.getItem("name"))
    $('#sidenav-email').html(localStorage.getItem("email"))
    $('.nav-links').removeClass("hide")
    populateTodos()
}

function populateTodos(){
    $.ajax({
        url: `http://104.154.192.253:3000/user/${localStorage.getItem("name")}`,
        method: "GET",
        headers: {
            token: localStorage.getItem("token")
        }
    }).done(userData => {
        let userTodos = $('#user-todos .row')
        console.log(userData.todos.length)
        if(userData.todos.length === 0){
            console.log('show no item')
            $('#no-item').show()
        }else{
            console.log('hide no item')
            $('#no-item').hide()
        }
        userTodos.empty()
        userData.todos.forEach((todo, x) => {
            userTodos.append(
                `<div class="col s12 m6">
                    <div class="todo-list card" materialize>

                        <div class="header light-blue darken-2 white-text "animated bounceIn">
                            <div class="row">
                                <div class="col s12 m10" style="line-height: 5px">
                                    <h5>${todo.title}</h5>
                                    <p style="font-size: 12dp">${moment(todo.createdAt).startOf('hour').fromNow()}</p>
                                </div>
                                <div class="col s6 m1">
                                    <i class="material-icons">edit</i>
                                </div>
                                <div class="col s6 m1">
                                <a href="#delete"><i class="material-icons" todoId="${todo._id}" id="deleteTodo-${x}">delete</i></a>
                                </div>
                            </div>
                        </div>

                        <div class="tasks-${x}">

                        <div>

                        <div id="submit-change-btn">
                            <label>
                                <div class="row center">
                                    <div class="col s6">
                                        <a class="waves-effect waves-light btn-submit-change"><i class="material-icons left">save</i>save</a>
                                    </div>
                                    <div class="col s6">
                                        <a class="waves-effect waves-light btn-cancel-change"><i class="material-icons left">cancel</i>cancel</a>
                                    </div>
                                </div>
                            </label>
                        </div>

                    </div>
                </div>
                `
            )

            $(`#deleteTodo-${x}`).click(event => {
                event.preventDefault()
                deleteTodo($(`#deleteTodo-${x}`).attr('todoId'))
            })

            todo.tasks.forEach(task => {
                let st = ""
                let status = task.task_status
                if(status) st = "checked='checked'"
                $(`.tasks-${x}`).append(
                    `<div class="item">
                        <label>
                            <input type="checkbox" ${st} value="${task.task_status.toString()}" id="task"/>
                            <span>${task.task_name}</span>
                        </label>
                    </div>`
                )
            })
        })
        init()
    }).fail(err => {
        console.log('ajax request failed')
    })
}

function deleteTodo(todoId){
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be reversed",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, I don\'t need it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: `http://104.154.192.253:3000/todo/${todoId}`,
                method: "DELETE",
                headers: {
                    token: localStorage.getItem("token")
                }
            }).done(() => {
                populate()
            })
        }
    })
}

function onSignIn(googleUser) {
    let id_token = googleUser.getAuthResponse().id_token
    $.ajax({
        url: "http://104.154.192.253:3000/user/signIn",
        method: "POST",
        headers: {
            id_token
        }
    }).done(userData => {
        localStorage.setItem('token', userData.token)
        localStorage.setItem('id', userData.id)
        localStorage.setItem('name', userData.name)
        localStorage.setItem('email', userData.email)
        localStorage.setItem('todos', userData.todos)
        localStorage.setItem('picture', userData.picture)
        showApp()
        M.toast({html: `Welcome, ${localStorage.getItem("name")}`})

    })

}