const newTaskContainer = document.querySelector('#add-task-container');
const newTaskButton = document.querySelector('#add-task-button');
const closeButton = document.querySelector("#close-button");
const overlay = document.querySelector("#overlay");
const container = document.querySelector('#container');
const form = document.querySelector('#form');
const LS_KEY = 'MY_TASKS';
const taskList = document.querySelector('#tasks-list');
const dateNumber = document.querySelector('#date-number');
const monthName = document.querySelector('#month-name');
const dayName = document.querySelector('#day-name');
const currentDate = new Date();
const daysOfWeek = document.getElementsByClassName('day');
const welcomeStats = document.querySelector('#welcomeStat');


taskList.innerHTML = getState();

dateNumber.innerHTML = currentDate.getDate();
getCurrentMonth();
getCurrentDateName();
showStats();


function getCurrentMonth() {
	const montNames = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря',]
	monthName.innerHTML = montNames[currentDate.getMonth()];
		
}

function getCurrentDateName() {
	const daysNames = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница','суббота','воскресенье']
	dayName.innerHTML = daysNames[currentDate.getDay()-1];
	daysOfWeek[currentDate.getDay()-1].classList.add('active-date');

}

function showStats() {
	const taskTotal = document.getElementsByClassName('task');
	welcomeStats.innerHTML = `<p>Задач в списке: ${taskTotal.length}</p> `
}

function getTodayTasksTotal() {

}

newTaskButton.addEventListener('click', (event) => {
	newTaskContainer.classList.remove("hide");
	overlay.classList.remove("hide");
	newTaskButton.classList.add("hide");

})

function closeModal() {
	newTaskContainer.classList.add("hide");
	newTaskButton.classList.remove("hide");
	overlay.classList.add("hide");

}




container.addEventListener('click', (event) => {
	if (event.target.classList.contains("done")) {
		event.target.classList.remove('done');
		event.target.closest(".task").querySelector('.task-text').classList.remove('del');
		
		saveState();
	} else if (event.target.classList.contains("delegate")) {
		event.target.classList.add('done');
		event.target.classList.remove('delegate');
		event.target.closest(".task").querySelector('.task-text').classList.add('del');
		
		saveState();
	} else if (event.target.classList.contains("forward")) {
		event.target.classList.add('delegate');
		event.target.classList.remove('forward');
		saveState();
	} else if (event.target.classList.contains("in-progress")) {
		event.target.classList.add('forward');
		event.target.classList.remove('in-progress');
		saveState();
	}  else if (event.target.classList.contains("task-marker")) {
		event.target.classList.add('in-progress');
		event.target.classList.remove('task-marker');
		saveState();
	}  else if (event.target.classList.contains("marker")) {
		event.target.classList.add('task-marker');
		saveState();
	} 
	if (event.target.classList.contains("del_btn")) {
		const element = event.target.closest(".task");
		element.remove();
		showStats()
		saveState();
	} 
});



form.addEventListener('submit', (event) => {

  event.preventDefault();

  const title = event.target.newtitle;
	
  if(!title.value) {
    return
  } else {
    taskList.innerHTML += `<div class="task">
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="marker"></div>
		<div class="task-text">${title.value}</div>
		<div class="del_btn">Удалить</div>
	</div>`;
	showStats()
  }

title.value = '';
saveState();
console.log(oldHtml);
})

let oldHtml = taskList.innerHTML;

function saveState() {
	oldHtml = taskList.innerHTML;
	localStorage.setItem(LS_KEY, oldHtml);
	}
	
	
	function getState() {
	const raw = localStorage.getItem(LS_KEY);
	return raw ? raw : "";
	}
