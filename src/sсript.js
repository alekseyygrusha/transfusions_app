let __COMMON = function (params = {}) {
    let containers = {
        // additional_container: {
        //     capacity: 5,
        //     jam: 0,
        //     name: "additional_container"
        // },

        // additional_container_2: {
        //     capacity: 3,
        //     jam: 0,
        //     name: "additional_container"
        // },
    }

    let game_options = {
        points_counter : 0,
        poure_status: false,
        from: '',
        to: '', 
        levels: 2,
        levels_counter: 1, 
        seconds: 300,
        timerId: '',
        gameActive: true,
    }

    let additional_functions = {
        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
        },

        secondsTimer: function (event) {
            var timerBlock = $('.timer');
           
            
            let timer_func = {
                timer_start: function () {
                    var num = game_options.seconds; //количество секунд
                    game_options.timerId = setInterval(function() {
                        timerBlock.html(--num);
                    }, 1000);
                    setTimeout(function() {
                        clearInterval(game_options.timerId);
                        if (game_options.gameActive) {
                            functions.gameLose();
                            $('.timer-wrap').hide();
                        }
                    }, num*1000); 
                },
                timer_stop: clearInterval(game_options.timerId)
            }

            if (event = "start") {
                timer_func.timer_start();
            }

            if (event = "stop") {
                timer_func.timer_stop;
            }
        }
    }

    let generate_options = {
        id_counter: 1,
        additional_containers_count: additional_functions.getRandomInt(2, 4)
    }

    

    let selectors = {
        containers_wrap: document.querySelector('.containers-wrap'),
    }

    let __init = function () {
        functions.chooseLevel();
    }

    let __start = function () {
        additional_functions.secondsTimer("start");
        option_functions.generateOptions();
        functions.initContainers();
        functions.skipHandler();
        functions.levelsEvent();
    }

    let option_functions = {
        generateOptions: function () {
            option_functions.generateMainContainers();
            option_functions.generateAdditionalContainers();
            console.log(containers);
            console.log(generate_options.additional_containers_count);
        },
        generateMainContainers: function () {
            function generateJamContainer () {
                option_functions.generateContainer("jam");
                containers.jam_container.jam = 8;
                containers.jam_container.capacity = 8;
            }
            function generatePlayerContainer () {
                option_functions.generateContainer("player");
                containers.player_container.jam = 0;
                containers.player_container.capacity = additional_functions.getRandomInt(3, 5);
            }

            generateJamContainer();
            generatePlayerContainer(); 
        },
        generateAdditionalContainers: function () {
            for (let i = 0; generate_options.additional_containers_count > i; i++) {
                this.generateContainer("additional", id = generate_options.id_counter);
                generate_options.id_counter++;
            }
            
        },

        generateContainer: function (name , id = 0) {
            let container_name;
            let capacity_count = additional_functions.getRandomInt(1, 8);

            id ? container_name = name + "_container_" + id 
            : container_name = name + "_container";

             
            let container_tamplate = {
                  [container_name]: {
                    capacity: capacity_count,
                    jam: 0,
                    name: name + '_container'
                  }
            }
            containers[container_name] = container_tamplate[container_name];
        },

        deleteObject: function () {
            for(key in containers) {
                delete containers[key];
            }
        }
    }

    let functions = {
        chooseLevel: function () {
            $('.level-button').on('click', function () {
                let level = $(this).data('level');
                switch (level) {
                    case "ease":
                        game_options.seconds = 60;
                        break;
                    case "normal":
                        game_options.seconds = 45;  
                        break;
                    case "hard":
                        game_options.seconds = 30;    
                        break;   
                }
                $('.levels-container').show();
                $('.level-container').hide();
                __start();
            })
        },
        initContainers: function () {
            functions.generateContainers();
            functions.containerHandler();
        },

        generateContainers: function () {
            for (let container_item in containers) {
                this.createContainer(container_item);
            }
        },

        createContainer: function (container_info) {
            let container_template =  document.createElement('div');
            container_template.classList.add('container');
            container_template.setAttribute("id", container_info);
            game_options.id_counter++;
            let containers_wrap = document.querySelector(".containers-wrap");
            containers_wrap.appendChild(container_template);
            this.fillIndicator(container_template, container_info);
        },

        fillIndicator: function (container_template, container_info) {
            let container_capacity = containers[container_info].capacity;
            let jam_capacity = containers[container_info].jam;
            let indicator = document.createElement('div');
            indicator.classList.add('indicator');

            for (let count = 0; container_capacity > count; count++) {
                let clone_indicator = indicator.cloneNode();
                if(jam_capacity && jam_capacity > count) {
                    clone_indicator.classList.add("jam");
                }
                container_template.appendChild(clone_indicator);
            }

        },

        containerHandler: function () {
            let container_items = $('.containers-wrap').find(".container");
            $(container_items).on('click', function () {
                let current_container = containers[this.id];
                functions.poureTheСontainer(current_container);
            });
        }, 

        poureTheСontainer: function (container) {
            if (!game_options.poure_status && container.jam) {
                //Если это первый клик, то значит берём содержимое ёмкости
                game_options.poure_status = true;
                document.body.classList.toggle('-take');
                game_options.from = container;
                console.log("Взяли контейнер " + container.name )
            } else if (game_options.poure_status) {
                //если сработало это условие, значит мы уже взяли джем и ищем куда его поместить
                functions.checkFillReady(container); 
            } else if (!container.jam) {
                alert("Тут пусто")
            }
        },

        checkFillReady: function(container) {
            if(container.jam < container.capacity) {
                console.log("Место для джема есть, заполняем сколько поместится")
                game_options.poure_status = false;
                let empty_count = container.capacity - container.jam;
                
                while (game_options.from.jam > 0 && empty_count > 0 ) {
                    game_options.from.jam--;
                    empty_count--;
                    container.jam++;
                }
                document.body.classList.toggle('-take');
                functions.reloadIndicator();
            } else {
                alert("Место для джема нету")
            }

           
        },

        deleteIndicator: function() {
            let all_indicators = $(".containers-wrap").find('.indicator');
            $(all_indicators).remove();
        },

        reloadIndicator: function () {
            this.deleteIndicator();
            for (let container_item in containers) {
                let container_template = document.querySelector(`#${container_item}`);
                this.fillIndicator(container_template, container_item);
            }
            game_options.points_counter++;
            setTimeout(this.checkVictory(), 5000);
            
        },

        checkVictory: function () {
            console.log("checkVictory");
            if(checkAdditionalContainers() && containers.player_container.jam == 2) {
                console.log("if checkVictory")
                game_options.levels_counter++;
                game_options.levels_counter < game_options.levels + 1 ? this.reloadGame() : this.finishGame();
                
            }

            function checkAdditionalContainers () {
                for (key in containers) {
                    if( containers[key].name == "additional_container") {
                        if (containers[key].jam == 0) {
                            continue;
                        } else {
                            return false;
                        }
                    }
                }
                return true;
            }
        },

        reloadGame: function () {
            
            let reload_button_wrap = document.createElement('div');
            let reload_button = document.createElement("div");

            reload_button_wrap.classList.add('reload-wrap');
            reload_button.classList.add('reload-button');
            reload_button.innerHTML = "Следующий уровень";
            reload_button_wrap.appendChild(reload_button);
            $('.containers-wrap').append(reload_button_wrap);
            reload_button.addEventListener("click", function () {
                functions.levelsEvent();
                reload_button_wrap.remove();
                functions.reload();
            });
            
        },

        reload: function () {
            option_functions.deleteObject();
            functions.deleteDom();
            option_functions.generateOptions();
            functions.initContainers();
        },

        deleteDom: function () {
            $(".containers-wrap").find('.container').remove();
        },

        finishGame: function () {
            additional_functions.secondsTimer('stop');
            let victory_text = document.createElement("div");
                victory_text.classList.add('victory_text');
                victory_text.innerHTML = `Вы победили за ${game_options.points_counter} шага(-ов)`;
                document.body.appendChild(victory_text);
            $('.timer-wrap').hide();    
            $('.skip').hide();
        },

        skipHandler: function () {
            $(".skip").on('click', function () {
                functions.reload();
            });
        }, 

        levelsEvent: function () {
            let current_level = document.querySelector('.current-level');
            let level_count = document.querySelector('.levels-count');
            current_level.innerHTML = game_options.levels_counter;
            level_count.innerHTML = game_options.levels;
        },

        gameLose: function () {
            let replay_button_wrap = document.createElement('div');
            let replay_button = document.createElement("div");
            replay_button_wrap.classList.add('reload-wrap');
            replay_button.classList.add('replay-button');
            replay_button.innerHTML = "Попробовать снова";
            replay_button.addEventListener('click', function () {
                window.location.reload();
            });

            replay_button_wrap.appendChild(replay_button);
            $('.containers-wrap').append(replay_button_wrap);
        }
    }

    return __init;
}();