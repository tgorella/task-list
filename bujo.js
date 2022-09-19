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
	const daysNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница','суббота']
	dayName.innerHTML = daysNames[currentDate.getDay()];
	if (currentDate.getDay() ===  0) {
		daysOfWeek[6].classList.add('active-date');
	} else {
	daysOfWeek[currentDate.getDay()-1].classList.add('active-date');
}}

function showStats() {
	getTotalTasks();
	getCurrentDateTaskTotal();
}

function getTotalTasks() {
	const taskTotal = tasks.length;
	welcomeStats.innerHTML = `<p>Задач в списке: ${taskTotal}</p> `;
}

function getCurrentDateTaskTotal() {
	const statusNames = ['sunStatus', 'monStatus','tueStatus','wedStatus','thurStatus','friStatus','satStatus'];
	const total = tasks.filter( (task) => {
		const dayKey = task[statusNames[currentDate.getDay()]];
			return dayKey !== ''}).length;
	const done = tasks.filter( (task) => {
		const dayKey = task[statusNames[currentDate.getDay()]];
					return dayKey === 'done'}).length;
				const percent =  Number.parseInt(done * 100 / total)
	welcomeStats.innerHTML += `<p class="today_total">Задач на сегодня: ${total}</p>
	<p style="progress-title">Прогресс:</p>
			<div class="progress_container"><div class="progress_value" id="progress">${percent}%</div></div>
			`
			const progress = document.querySelector('#progress')
			progress.style.width = percent+'%';
			if (isNaN(percent)) {
				progress.textContent = 'Cегодня отдыхаем :)';
				progress.style.width = 100+'%';
				progress.style.backgroundColor = 'transparent';
				progress.style.color = '#000';
			};
}

function renderTaskList() {
	taskList.innerHTML = "";
	tasks.map( (task) => {
		taskList.innerHTML += `<div data-name="task" class="task" id="${task.id}">
		<div data-day="mon" class="marker ${task.monStatus}"></div>
		<div data-day="tue" class="marker ${task.tueStatus}"></div>
		<div data-day="wed" class="marker ${task.wedStatus}"></div>
		<div data-day="thur"class="marker ${task.thurStatus}"></div>
		<div data-day="fri" class="marker ${task.friStatus}"></div>
		<div data-day="sat" class="marker ${task.satStatus}"></div>
		<div data-day="sun" class="marker ${task.sunStatus}"></div>
		<div class="task-text">${task.text}</div>
		<div data-btn="del" class="del_btn">Удалить</div>
	</div>`;
	showStats()
	})
}

function deleteTask(id) {
	const itemToDel = tasks.findIndex( (item) => item.id === Number(id));
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
	let id = event.target.closest("[data-name='task']")?.id;

	if (event.target.dataset.day === "mon") {
		changeTaskStatus(id, 'monStatus')
	}
	if (event.target.dataset.day === "tue") {
		changeTaskStatus(id, 'tueStatus')
	}
	if (event.target.dataset.day === "wed") {
		changeTaskStatus(id, 'wedStatus')
	}
	if (event.target.dataset.day === "thur") {
		changeTaskStatus(id, 'thurStatus')
	}
	if (event.target.dataset.day === "fri") {
		changeTaskStatus(id, 'friStatus')
	}
	if (event.target.dataset.day === "sat") {
		changeTaskStatus(id, 'satStatus')
	}
	if (event.target.dataset.day === "sun") {
		changeTaskStatus(id, 'sunStatus')
	}
	if (event.target.dataset.btn === "del") {
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
