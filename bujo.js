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


let tasks = getState();

dateNumber.innerHTML = currentDate.getDate();

getCurrentMonth();
getCurrentDateName();
showStats();
renderTaskList();

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
	getTotalTasks();
	getCurrentDateTaskTotal();
}

function getTotalTasks() {
	const taskTotal = tasks.length;
	welcomeStats.innerHTML = `<p>Задач в списке: ${taskTotal}</p> `;
}

function getCurrentDateTaskTotal() {
	const statusNames = ['monStatus','tueStatus','wedStatus','thurStatus','friStatus','satStatus','sunStatus'];
	const total = tasks.filter( (task) => {
		const dayKey = task[statusNames[currentDate.getDay()-1]];
			return dayKey !== ''}).length;
	const done = tasks.filter( (task) => {
		const dayKey = task[statusNames[currentDate.getDay()-1]];
					return dayKey === 'done'}).length;
				const percent =  Number.parseInt(done * 100 / total)
	welcomeStats.innerHTML += `<p class="today_total">Задач на сегодня: ${total}</p>
	<p style="progress-title">Прогресс:</p>
			<div class="progress_container"><div class="progress_value" id="progress">${percent}%</div></div>
			`
			const progress = document.querySelector('#progress')
			progress.style.width = percent+'%';
			if (isNaN(percent)) {
				progress.textContent = 'Кажется, сегодня отдыхаем :)';
				progress.style.width = 100+'%';
				progress.style.backgroundColor = 'transparent';
				progress.style.color = '#000';
			};
}

function renderTaskList() {
	taskList.innerHTML = "";
	tasks.map( (task) => {
		taskList.innerHTML += `<div class="task" id="${task.id}">
		<div class="mon marker ${task.monStatus}"></div>
		<div class="tue marker ${task.tueStatus}"></div>
		<div class="wed marker ${task.wedStatus}"></div>
		<div class="thur marker ${task.thurStatus}"></div>
		<div class="fri marker ${task.friStatus}"></div>
		<div class="sat marker ${task.satStatus}"></div>
		<div class="sun marker ${task.sunStatus}"></div>
		<div class="task-text">${task.text}</div>
		<div class="del_btn">Удалить</div>
	</div>`;
	showStats()
	})
}

function deleteTask(id) {
	const itemToDel = tasks.findIndex( (item) => { item.id === id})
	tasks.splice(itemToDel, 1);
	renderTaskList();
		showStats();
		saveState();
}

function closeModal() {
	newTaskContainer.classList.add("hide");
	newTaskButton.classList.remove("hide");
	overlay.classList.add("hide");
}

newTaskButton.addEventListener('click', (event) => {
	newTaskContainer.classList.remove("hide");
	overlay.classList.remove("hide");
	newTaskButton.classList.add("hide");
})

container.addEventListener('click', (event) => {
	let id = event.target.closest(".task").id;

	if (event.target.classList.contains("mon")) {
		changeTaskStatus(id, 'monStatus')
	}
	if (event.target.classList.contains("tue")) {
		changeTaskStatus(id, 'tueStatus')
	}
	if (event.target.classList.contains("wed")) {
		changeTaskStatus(id, 'wedStatus')
	}
	if (event.target.classList.contains("thur")) {
		changeTaskStatus(id, 'thurStatus')
	}
	if (event.target.classList.contains("fri")) {
		changeTaskStatus(id, 'friStatus')
	}
	if (event.target.classList.contains("sat")) {
		changeTaskStatus(id, 'satStatus')
	}
	if (event.target.classList.contains("sun")) {
		changeTaskStatus(id, 'sunStatus')
	}
	if (event.target.classList.contains("del_btn")) {
		deleteTask(id);		
	} 
});

function changeTaskStatus(id, key) {
	const findedItem = tasks.findIndex( (item) => item.id === Number(id));
	let status = tasks[findedItem][key];
		switch (status) {
			case '':
				tasks[findedItem][key] = 'task-marker';
				break;
			case 'task-marker':
				tasks[findedItem][key] = 'in-progress';
				break;
			case 'in-progress':
				tasks[findedItem][key] = 'forward';
				break;
			case 'forward':
				tasks[findedItem][key] = 'delegate';
				break;
			case 'delegate':
				tasks[findedItem][key] = 'done';
				break;
			case 'done':
				tasks[findedItem][key] = '';
				break;
		}
		saveState();
		renderTaskList();
}

form.addEventListener('submit', (event) => {

  event.preventDefault();

  const title = event.target.newtitle;
	
  if(!title.value) {
    return
  } else {
		tasks[tasks.length] = {
			id: Number.parseInt(Math.random()*100000),
			text: title.value,
			monStatus: '',
			tueStatus: '',
			wedStatus: '',
			thurStatus: '',
			friStatus: '',
			satStatus: '',
			sunStatus: '',
		}
	showStats();
	renderTaskList();
	saveState();
  }
	
title.value = '';
})

function saveState() {
	localStorage.setItem(LS_KEY, JSON.stringify(tasks));
	}
	
	function getState() {
		const raw = localStorage.getItem(LS_KEY);
		return raw ? JSON.parse(raw) : [];
	}
