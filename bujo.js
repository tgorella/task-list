const newTaskContainer = document.querySelector('#add-task-container');
const newHabitContainer = document.querySelector('#add-habit-container');
const newTaskButton = document.querySelector('#add-task-button');
const closeButton = document.querySelector("#close-button");
const overlay = document.querySelector("#overlay");
const container = document.querySelector('[data-id="container"]');
const form = document.querySelector('#form');
const habitForm = document.querySelector('#habit_form');
const LS_KEY = 'MY_TASKS';
const taskList = document.querySelector('#tasks-list');
const dateNumber = document.querySelector('#date-number');
const monthName = document.querySelector('#month-name');
const dayName = document.querySelector('#day-name');
let currentDate = new Date();
const daysOfWeek = document.getElementsByClassName('day');
const welcomeStats = document.querySelector('#welcomeStat');
const habitContainer = document.querySelector('[data-id="habit_tracker"]');

class Task {
	constructor(id, text, monStatus = '', tueStatus = '', wedStatus = '', thurStatus = '', friStatus = '', sunStatus = '', satStatus = '') {
		this.id = id;
		this.text = text;
		this.monStatus = monStatus;
		this.tueStatus = tueStatus;
		this.wedStatus = wedStatus;
		this.thurStatus = thurStatus;
		this.friStatus = friStatus;
		this.satStatus = satStatus;
		this.sunStatus = sunStatus;
	}

	changeTaskStatus(status) {
		switch (this[status]) {
			case '':
				this[status] = 'task-marker';
				break;
			case 'task-marker':
				this[status] = 'in-progress';
				break;
			case 'in-progress':
				this[status] = 'forward';
				break;
			case 'forward':
				this[status] = 'delegate';
				break;
			case 'delegate':
				this[status] = 'done';
				break;
			case 'done':
				this[status] = '';
				break;
		}
		saveState();
		renderTaskList();
	}
}

class Habit extends Task {
	constructor (id, text, numberOfDays) {
		super(id, text);
		this.id = id;
		this.text = text;
		this.day = [];
		delete this.monStatus;
		delete this.tueStatus;
		delete this.wedStatus;
		delete this.thurStatus;
		delete this.friStatus;
		delete this.sunStatus;
		delete this.satStatus;

	
		if (!isNaN(numberOfDays)) {
		for (let i=0; i < numberOfDays; i++) {
			this.day[i] = '';
		}
	} else {
		numberOfDays.map( (day, index) => {
this.day[index] = day;
		});
	}};


	changeTaskStatus(i) {
		switch (this.day[i]) {
			case '':
				this.day[i] = 'done';
				break;
			case 'done':
				this.day[i] = '';
				break;
		}
		renderHabitList();
	saveState();
}
}

let tasks = getState();
let habits = getHabitsState();

updateDate();
showStats();
renderTaskList();
renderHabitList();
setInterval(updateDate, 3600000);

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

function updateDate() {
	currentDate = new Date();
	dateNumber.innerHTML = currentDate.getDate();
	getCurrentMonth();
	getCurrentDateName();
	console.log('прошел час',currentDate)
}

function showStats() {
	getTotalTasks();
	getCurrentDateTaskTotal();
}

function getTotalTasks() {
	const taskTotal = tasks.length;
	welcomeStats.innerHTML = `<p style="font-size: 14px;">Задач в списке: ${taskTotal}</p> `;
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
	<p class="progress-title">Прогресс:</p>
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
		if (tasks.length > 0 ) {
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
		<div data-btn="del" class="del_btn">x</div>
	</div>`;
	showStats()
	})
} else {	
	taskList.innerHTML = `<p style="text-align:center; margin-top: 20px; background-color: #eee; padding: 25px 0; border-radius: 9px;">Задач пока нет, нажмите на <span style="color:#fff; background-color:rgb(222, 0, 85); border-radius: 50%; padding: 0 5px 1px;">+</span> и создайте новую.</p>`;
}
}

function renderHabitList() {
	if (habits.length > 0 ) {
		// console.log(habitContainer)
		habitContainer.innerHTML = "";
habits.map( (habit) => {
	habitContainer.innerHTML += `<div class="habit" data-name='habit' id="${habit.id}">
	<div class="habit__title" >${habit.text} </div>
	<div class="habit__days" data-days="${habit.id}">
	</div>
	<div data-btn="del" class="habits_del_btn">x</div></div>`;
const habitDays = document.querySelector(`[data-days="${habit.id}"]`);
habit.day.map( (day, index) => {
habitDays.innerHTML += `<div class="h__day ${day}" data-dayNumber="${index}">${index+1}</div>`;
})
})
} else {	
habitContainer.innerHTML = `<p style="text-align:center; margin-top: 20px; background-color: #eeac58; padding: 25px; border-radius: 9px;">Вы пока не отслеживаете привычки, нажмите на <span style="color:#fff; background-color:rgb(222, 0, 85); border-radius: 50%; padding: 0 5px 1px;">+</span> и создайте новую.</p>`;
}
}


function deleteTask(id) {
	const itemToDel = tasks.findIndex( (item) => item.id === Number(id));
	tasks.splice(itemToDel, 1);
	renderTaskList();
		showStats();
		saveState();
}

function deleteHabit(id) {
	const itemToDel = habits.findIndex( (item) => item.id === Number(id));
	habits.splice(itemToDel, 1);
	renderHabitList();
	saveState();
}

function closeModal() {
	newTaskContainer.classList.add("hide");
	newHabitContainer.classList.add("hide");
	newTaskButton.classList.remove("hide");
	overlay.classList.add("hide");
}

newTaskButton.addEventListener('click', (event) => {
	if (!event.target.classList.contains('active')) {
		newTaskButton.classList.add("active");
	}
	if(event.target.dataset.target === "task") {
	newTaskContainer.classList.remove("hide");
	overlay.classList.remove("hide");
	newTaskButton.classList.remove("active");
	newTaskButton.classList.add("hide");
	}

	if(event.target.dataset.target === "habit") {
		newHabitContainer.classList.remove("hide");
		overlay.classList.remove("hide");
	newTaskButton.classList.remove("active");
		newTaskButton.classList.add("hide");
		}
})

container.addEventListener('click', (event) => {
	let id = event.target.closest("[data-name='task']")?.id;
	const index = tasks.findIndex( (task) => task.id === Number(id));

	if (event.target.dataset.day === "mon") {
		tasks[index].changeTaskStatus('monStatus');
	}
	if (event.target.dataset.day === "tue") {
		tasks[index].changeTaskStatus('tueStatus');
	}
	if (event.target.dataset.day === "wed") {
		tasks[index].changeTaskStatus('wedStatus');
	}
	if (event.target.dataset.day === "thur") {
		tasks[index].changeTaskStatus('thurStatus');
	}
	if (event.target.dataset.day === "fri") {
		tasks[index].changeTaskStatus('friStatus');
	}
	if (event.target.dataset.day === "sat") {
		tasks[index].changeTaskStatus('satStatus');
	}
	if (event.target.dataset.day === "sun") {
		tasks[index].changeTaskStatus('sunStatus');
	}
	if (event.target.dataset.btn === "del") {
		deleteTask(id);
	} 
});

habitContainer.addEventListener('click', (event) => {
	let id = event.target.closest("[data-name='habit']")?.id;
	
	const index = habits.findIndex( (habit) => habit.id === Number(id));
	if (event.target.dataset.daynumber) {
			habits[index].changeTaskStatus(event.target.dataset.daynumber);
	}
			if (event.target.dataset.btn === "del") {
				deleteHabit(id);
			} 
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = event.target.newtitle;
  if(!title.value) {
    return
  } else {
		tasks[tasks.length] = new Task(Number.parseInt(Math.random()*100000), title.value)
	showStats();
	renderTaskList();
	saveState();
  }
title.value = '';
})

habitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = event.target.habitTitle;
	const numberOfDays = event.target.numberOfDays;
  if(!title.value || !numberOfDays.value) {
    return
  } else {
		habits[habits.length] = new Habit(Number.parseInt(Math.random()*100000), title.value, numberOfDays.value);
	
title.value = '';
numberOfDays.value = '';
}
renderHabitList();
	saveState();
})

function saveState() {
	localStorage.setItem('MY_TASKS', JSON.stringify(tasks));
	localStorage.setItem('MY_HabiTS', JSON.stringify(habits));
	}
	
	function getState() {
		if (localStorage.getItem('MY_TASKS')!= null) {
			const raw = (JSON.parse(localStorage.getItem('MY_TASKS')).map((taskData) => {
			const { id, text, monStatus, tueStatus, wedStatus, thurStatus, friStatus, sunStatus, satStatus } = taskData;
			return new Task (id, text, monStatus, tueStatus, wedStatus, thurStatus, friStatus, sunStatus, satStatus);
		})
		) 
		return raw;
	} else {
		const raw = [];
		return raw;
	}
	
}
function getHabitsState() {
	if (localStorage.getItem('MY_HabiTS')!= null) {
		const raw = (JSON.parse(localStorage.getItem('MY_HabiTS'))
		.map((habitData) => {
		const { id, text, day } = habitData;
		return new Habit (id, text, day);
	})
	) 
	return raw;
} else {
	const raw = [];
	return raw;
}

}