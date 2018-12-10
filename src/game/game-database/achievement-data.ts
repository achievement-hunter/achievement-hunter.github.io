import {GameEvent} from "../game-event";
import {AchievementDataRecord} from "./achievement-data-record";
import Upgrade from "../upgrade";
import {AchievementPack} from "../achievement-pack";
import {AchievementInfo} from "../achievement";
import EventHub from "../../event-hub";
import GameState from "../game-state";

export default class AchievementData {
    static create(): AchievementDataRecord[] {
        return [
            {
                id: 0,
                pack: -1,
                name: "Dummy achievement",
                points: 1
            },
            ...createPack(AchievementPack.START,
                {
                    id: 1,
                    name: "First one is always free",
                    hint: "Click this achievement",
                    hintVisible: true,
                    points: 1,
                    unsubscribe: () => {
                        Upgrade(1).unlock();
                    },
                    events: {
                        [GameEvent.ACHIEVEMENT_CLICKED]: () => {
                            completeAchievement();
                        }
                    }
                }
            ),
            ...createPack(AchievementPack.THE_BUTTON,
                {
                    id: 2,
                    name: "One button to rule them all",
                    hint: "Unlock The Button",
                    hintVisible: true,
                    points: 1,
                    events: {
                        [GameEvent.THE_BUTTON_UNLOCKED]: completeAchievement
                    }
                },
                {
                    id: 3,
                    name: "Finger on the red button",
                    hint: "Hover The Button",
                    hintVisible: true,
                    points: 1,
                    events: {
                        [GameEvent.THE_BUTTON_MOUSE_ENTER]: completeAchievement
                    }
                },
                {
                    id: 4,
                    name: "Red alert",
                    hint: "Click The Button",
                    hintVisible: true,
                    points: 1,
                    unsubscribe: () => {
                        Upgrade(2).unlock();
                    },
                    events: {
                        [GameEvent.THE_BUTTON_CLICK]: () => {
                            completeAchievement();
                        }
                    }
                },
                {
                    id: 5,
                    name: "Not this kind of game",
                    hint: "Click The Button 10 times",
                    hintVisible: true,
                    goal: 10,
                    points: 2,
                    events: {
                        [GameEvent.THE_BUTTON_CLICK]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 6,
                    name: "Leave it alone",
                    hint: "Don't touch The Button for 5 seconds",
                    hintVisible: true,
                    points: 2,
                    goal: 5,
                    events: (function () {
                        let hover = false;
                        return {
                            [GameEvent.THE_BUTTON_MOUSE_ENTER]: () => {
                                hover = true;
                            },
                            [GameEvent.THE_BUTTON_MOUSE_LEAVE]: () => {
                                hover = false;
                                currentAchievement().progress = 0;
                            },
                            [GameEvent.UPDATE]: (delta: number) => {
                                if (!hover) {
                                    currentAchievement().progress += delta;
                                }
                            }
                        };
                    })()
                },
                {
                    id: 7,
                    name: "HODL",
                    hint: "Hold The Button for 5 seconds",
                    hintVisible: true,
                    points: 3,
                    goal: 5,
                    events: (function () {
                        let hold = false;
                        return {
                            [GameEvent.THE_BUTTON_MOUSE_DOWN]: () => {
                                hold = true;
                                currentAchievement().progress = 0;
                            },
                            [GameEvent.THE_BUTTON_MOUSE_UP]: () => {
                                hold = false;
                            },
                            [GameEvent.UPDATE]: (delta: number) => {
                                if (hold) {
                                    currentAchievement().progress += delta;
                                }
                            }
                        };
                    })()
                }
            ),
            ...createPack(AchievementPack.PACK_1,
                {
                    id: 8,
                    name: "SPAAAAAAAAAAAAAAACE",
                    hint: "Press Space",
                    points: 1,
                    ...keyPressAchievement("space")
                },
                {
                    id: 9,
                    name: "Enter the Matrix",
                    hint: "Press Enter",
                    points: 1,
                    ...keyPressAchievement("enter")
                },
                {
                    id: 10,
                    name: "There is no Escape",
                    hint: "Press Esc",
                    points: 1,
                    ...keyPressAchievement("esc")
                },
                {
                    id: 11,
                    name: "Assuming Direct Control",
                    hint: "Press Ctrl",
                    points: 1,
                    ...keyPressAchievement("ctrl")
                },
                {
                    id: 12,
                    name: "Number One",
                    hint: "Press 1",
                    points: 1,
                    ...keyPressAchievement("1")
                },
                {
                    id: 13,
                    name: "STOP SCREAMING!!!!",
                    hint: "Press Shift or Caps Lock",
                    points: 1,
                    ...keyPressAchievement(["shift", "capslock"])
                },
                {
                    id: 14,
                    name: "Meaning of Life",
                    hint: "Press 42",
                    points: 10,
                    ...keyPressAchievement("4 2")
                },
                {
                    id: 15,
                    name: "Lucky Thirteen",
                    hint: "Press 13",
                    points: 13,
                    ...keyPressAchievement("1 3")
                },
                {
                    id: 16,
                    name: "Criminal scum",
                    hint: "Open the console",
                    points: 5,
                    ...keyPressAchievement(["ctrl+shift+c", "ctrl+shift+i", "ctrl+shift+j", "f12"])
                },
                {
                    id: 17,
                    name: "30 lives",
                    hint: "Input the Konami code",
                    points: 30,
                    ...keyPressAchievement("up up down down left right left right b a")
                },
                {
                    id: 18,
                    name: "Total disrespect",
                    hint: "Pay respects",
                    points: 1,
                    ...keyPressAchievement("f")
                },
                {
                    id: 19,
                    name: "Final countdown",
                    hint: "3... 2... 1...",
                    points: 3,
                    ...keyPressAchievement("3 2 1")
                },
                {
                    id: 20,
                    name: "Aye aye captain",
                    hint: "Mute the game",
                    points: 1,
                    events: {
                        [GameEvent.SOUNDS_OFF]: completeAchievement
                    }
                },
                {
                    id: 21,
                    name: "Can you hear me now?",
                    hint: "Unmute the game",
                    points: 1,
                    events: {
                        [GameEvent.SOUNDS_ON]: completeAchievement
                    }
                },
                {
                    id: 22,
                    name: "Click",
                    hint: "Click the screen",
                    points: 1,
                    events: {
                        [GameEvent.MOUSE_UP]: completeAchievement
                    }
                },
                {
                    id: 23,
                    name: "Clickity Click",
                    hint: "Click the screen 10 times",
                    points: 5,
                    goal: 10,
                    events: {
                        [GameEvent.MOUSE_UP]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 24,
                    name: "Clickity Clickest",
                    hint: "Click the screen 100 times",
                    points: 20,
                    goal: 100,
                    events: {
                        [GameEvent.MOUSE_UP]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 25,
                    name: "When life gives you lemons",
                    hint: "Earn an Achievement Point",
                    points: 1,
                    ...earnPointsAchievement(1)
                },
                {
                    id: 26,
                    name: "Hobby",
                    hint: "Earn 15 Achievement Points",
                    points: 5,
                    unsubscribe: () => {
                        Upgrade(3).unlock();
                        Upgrade(4).unlock();
                    },
                    ...earnPointsAchievement(15)
                },
                {
                    id: 27,
                    name: "Day job",
                    hint: "Earn 100 Achievement Points",
                    points: 10,
                    unsubscribe: () => {
                        Upgrade(11).unlock();
                    },
                    ...earnPointsAchievement(100)
                },
                {
                    id: 28,
                    name: "Small business",
                    hint: "Earn 1000 Achievement Points",
                    points: 50,
                    ...earnPointsAchievement(1000)
                },
                {
                    id: 29,
                    name: "Millionaire",
                    hint: "Earn one million Achievement Points",
                    points: 1000,
                    ...earnPointsAchievement(1000000)
                },
                {
                    id: 30,
                    name: "Do you need a walkthrough?",
                    hint: "Look for hints",
                    points: 1,
                    events: {
                        [GameEvent.ACHIEVEMENT_MOUSE_ENTER]: completeAchievement
                    }
                },
                {
                    id: 31,
                    name: "They see me scrolling",
                    hint: "Scroll the mouse wheel",
                    points: 1,
                    events: {
                        [GameEvent.MOUSE_WHEEL]: completeAchievement
                    }
                },
                {
                    id: 32,
                    name: "Grinding gears",
                    hint: "Open options",
                    points: 1,
                    events: {
                        [GameEvent.OPTIONS_OPENED]: completeAchievement
                    }
                },
                {
                    id: 33,
                    name: "Are you sure about that?",
                    hint: "Change your mind",
                    points: 1,
                    events: {
                        [GameEvent.HARD_RESET_ABORT]: completeAchievement
                    }
                },
                {
                    id: 34,
                    name: "Losing focus",
                    hint: "Click outside the game window",
                    points: 1,
                    events: {
                        [GameEvent.WINDOW_LOST_FOCUS]: completeAchievement
                    }
                },
                {
                    id: 35,
                    name: "Focusing on right things",
                    hint: "Click inside the game window",
                    points: 1,
                    events: {
                        [GameEvent.WINDOW_GAINED_FOCUS]: completeAchievement
                    }
                },
                {
                    id: 36,
                    name: "Good memory",
                    hint: "Save the game",
                    points: 1,
                    events: {
                        [GameEvent.SAVE]: completeAchievement
                    }
                },
                {
                    id: 37,
                    name: "Underachiever",
                    hint: "Complete an achievement",
                    points: 1,
                    ...achCountAchievement(1)
                },
                {
                    id: 38,
                    name: "Achiever",
                    hint: "Complete 25 achievements",
                    points: 5,
                    unsubscribe: () => {
                        Upgrade(8).unlock();
                        Upgrade(9).unlock();
                    },
                    ...achCountAchievement(25)
                },
                {
                    id: 39,
                    name: "Overachiever",
                    hint: "Complete 50 achievements",
                    points: 10,
                    ...achCountAchievement(50)
                },
                {
                    id: 40,
                    name: "Fizz",
                    hint: "Your system clock is divisible by 3",
                    points: 3,
                    ...fizzBuzzAchievement(3)
                },
                {
                    id: 41,
                    name: "Buzz",
                    hint: "Your system clock is divisible by 5",
                    points: 5,
                    ...fizzBuzzAchievement(5)
                },
                {
                    id: 42,
                    name: "FizzBuzz",
                    hint: "Your system clock is divisible by 3 and 5",
                    points: 15,
                    ...fizzBuzzAchievement(15)
                },
                {
                    id: 43,
                    name: "Fixing leaks",
                    hint: "Try to use arrows",
                    points: 1,
                    ...keyPressAchievement(["up", "down", "left", "right"])
                },
                {
                    id: 44,
                    name: "Knee-Deep in the Dead",
                    hint: "Try to use WASD",
                    points: 1,
                    ...keyPressAchievement(["w", "a", "s", "d"])
                },
                {
                    id: 45,
                    name: "Tiny spender",
                    hint: "Spend 10 achievement points",
                    points: 1,
                    ...spendPointsAchievement(10)
                },
                {
                    id: 46,
                    name: "Small spender",
                    hint: "Spend 100 achievement points",
                    points: 10,
                    ...spendPointsAchievement(100)
                },
                {
                    id: 47,
                    name: "Big spender",
                    hint: "Spend 1000000 achievement points",
                    points: 100,
                    ...spendPointsAchievement(1000000)
                },
                {
                    id: 48,
                    name: "Just to be sure",
                    hint: "Save 100 times without reloading the page",
                    points: 10,
                    goal: 100,
                    events: {
                        [GameEvent.SAVE]: () => currentAchievement().progress++,
                        [GameEvent.PAGE_RELOAD]: () => currentAchievement().progress = 0,
                    }
                },
                {
                    id: 49,
                    name: "Investment",
                    hint: "Purchase an upgrade",
                    points: 1,
                    ...upgradePurchaseAchievement(1)
                },
                {
                    id: 50,
                    name: "Diverse Investments",
                    hint: "Purchase 5 upgrades",
                    points: 10,
                    ...upgradePurchaseAchievement(5)
                },
                {
                    id: 51,
                    name: "Strategic Investments",
                    hint: "Purchase 10 upgrades",
                    points: 100,
                    ...upgradePurchaseAchievement(10)
                },
                {
                    id: 52,
                    name: "Soft reset",
                    hint: "Reload the page",
                    points: 10,
                    events: {
                        [GameEvent.PAGE_RELOAD]: completeAchievement
                    }
                },
                {
                    id: 53,
                    name: "Moving out",
                    hint: "Move the mouse",
                    points: 1,
                    events: {
                        [GameEvent.MOUSE_MOVE]: completeAchievement
                    }
                },
                {
                    id: 54,
                    name: "I like to move it",
                    hint: "Move the mouse over 5 meters",
                    points: 2,
                    ...mouseMoveAchievement(18500)
                },
                {
                    id: 55,
                    name: "I like to move it more",
                    hint: "Move the mouse over 25 meters",
                    points: 5,
                    ...mouseMoveAchievement(92500)
                },
                {
                    id: 56,
                    name: "Stay awhile and listen",
                    hint: "Play for a minute",
                    points: 1,
                    ...playTimeAchievement(1)
                },
                {
                    id: 57,
                    name: "Dedication",
                    hint: "Play for 10 minutes",
                    points: 3,
                    ...playTimeAchievement(10)
                },
                {
                    id: 58,
                    name: "You are still here?",
                    hint: "Play for an hour",
                    points: 5,
                    ...playTimeAchievement(60)
                },
                {
                    id: 59,
                    name: "Just to suffer",
                    hint: "Play for a day",
                    points: 25,
                    ...playTimeAchievement(60 * 24)
                },
                {
                    id: 60,
                    name: "Under The Hood",
                    hint: "Follow GitHub link",
                    points: 5,
                    events: {
                        [GameEvent.OPEN_REPO_LINK]: completeAchievement
                    }
                },
                {
                    id: 61,
                    name: "Abstention",
                    hint: "Don't complete an achievement for 10 seconds",
                    points: 1,
                    ...abstentionAchievement(10)
                },
                {
                    id: 62,
                    name: "Ascetic",
                    hint: "Don't complete an achievement for 10 minutes",
                    points: 5,
                    ...abstentionAchievement(10 * 60)
                },
                {
                    id: 63,
                    name: "Righteous Fury",
                    hint: "Click the right mouse button",
                    points: 1,
                    events: {
                        [GameEvent.RIGHT_MOUSE_UP]: completeAchievement
                    }
                },
                {
                    id: 64,
                    name: "You're not done yet",
                    hint: "Not completed the game",
                    points: 10,
                    ...(function () {
                        let passedTime = 0;
                        const delay = 5 * 60;
                        return {
                            events: {
                                [GameEvent.UPDATE]: (delta: number) => {
                                    passedTime += delta;
                                    if (passedTime < delay) return;
                                    if (Math.random() > 0.999) {
                                        completeAchievement();
                                    }
                                }
                            }
                        }
                    })()
                }
            ),
            ...createPack(AchievementPack.THE_DICE,
                {
                    id: 65,
                    name: "I would die for them",
                    hint: "Unlock The Dice",
                    points: 1,
                    events: {
                        [GameEvent.THE_DICE_UNLOCKED]: completeAchievement
                    }
                },
                {
                    id: 66,
                    name: "Curiosity",
                    hint: "Roll The Dice",
                    points: 1,
                    unsubscribe: () => {
                        Upgrade(5).unlock();
                    },
                    events: {
                        [GameEvent.THE_DICE_ROLL]: completeAchievement
                    }
                },
                {
                    id: 67,
                    name: "Passion",
                    hint: "Roll The Dice 10 times",
                    points: 5,
                    unsubscribe: () => {
                        Upgrade(6).unlock();
                    },
                    goal: 10,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 68,
                    name: "Addiction",
                    hint: "Roll The Dice 25 times",
                    points: 10,
                    unsubscribe: () => {
                        Upgrade(7).unlock();
                    },
                    goal: 25,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 69,
                    name: "Not a sexual reference",
                    hint: "Roll a Pair",
                    points: 5,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.length < 2) return;
                            if (values[0] === values[1] ||
                                values[0] === values[2] ||
                                values[1] === values[2]
                            ) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 70,
                    name: "Three-of-a-Kind",
                    hint: "Roll Three-of-a-Kind",
                    points: 20,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.length < 3) return;
                            if (values[0] === values[1] &&
                                values[0] === values[2]
                            ) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 71,
                    name: "Reinforcements",
                    hint: "Buy Second Die",
                    points: 5,
                    events: {
                        [GameEvent.THE_DICE_NEW_DIE]: () => {
                            if (GameState.current.dice > 1) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 72,
                    name: "Full Hand",
                    hint: "Buy Third Die",
                    points: 10,
                    events: {
                        [GameEvent.THE_DICE_NEW_DIE]: () => {
                            if (GameState.current.dice > 2) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 73,
                    name: "Night Player",
                    hint: "Roll The Dice with lights off",
                    points: 5,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: () => {
                            if (!GameState.current.lightsOn) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 74,
                    name: "Snake Eyes",
                    hint: "Roll 1 1",
                    points: 11,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.filter(v => v === 1).length >= 2) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 75,
                    name: "Devil's Luck",
                    hint: "Roll 6 6 6",
                    points: 666,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.filter(v => v === 6).length === 3) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 76,
                    name: "Final Rolldown",
                    hint: "Roll 3 2 1",
                    points: 20,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.length === 3 &&
                                values[0] === 3 &&
                                values[1] === 2 &&
                                values[2] === 1
                            ) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 77,
                    name: "Unlucky",
                    hint: "Roll nothing with three Dice",
                    points: 1,
                    events: {
                        [GameEvent.THE_DICE_ROLL]: (values: number[]) => {
                            if (values.length === 3 &&
                                values[0] !== values[1] &&
                                values[0] !== values[2] &&
                                values[1] !== values[2]
                            ) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 78,
                    name: "Age of automation",
                    hint: "Unlock The Dice-Roller",
                    points: 5,
                    events: {
                        [GameEvent.THE_DICE_ROLLER_UNLOCKED]: completeAchievement
                    }
                }
            ),
            ...createPack(AchievementPack.THE_SWITCH,
                {
                    id: 79,
                    name: "When he says \"go\"...",
                    hint: "Unlock The Switch",
                    points: 1,
                    events: {
                        [GameEvent.THE_SWITCH_UNLOCKED]: completeAchievement
                    }
                },
                {
                    id: 80,
                    name: "Dark Theme",
                    hint: "Turn off the lights",
                    points: 1,
                    events: {
                        [GameEvent.THE_SWITCH_SWITCH]: (isOn: boolean) => {
                            if (!isOn) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 81,
                    name: "Eye-friendly",
                    hint: "Turn on the lights",
                    points: 1,
                    events: {
                        [GameEvent.THE_SWITCH_SWITCH]: (isOn: boolean) => {
                            if (isOn) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 82,
                    name: "That's annoying",
                    hint: "Flip The Switch 10 times",
                    points: 5,
                    goal: 10,
                    events: {
                        [GameEvent.THE_SWITCH_SWITCH]: () => currentAchievement().progress++
                    }
                },
                {
                    id: 83,
                    name: "Bed time",
                    hint: "Turn off the lights at night",
                    points: 10,
                    events: {
                        [GameEvent.THE_SWITCH_SWITCH]: (isOn: boolean) => {
                            if (isOn) return;
                            const hour = new Date().getHours();
                            if (hour > 21 || hour < 4) {
                                completeAchievement();
                            }
                        }
                    }
                },
                {
                    id: 84,
                    name: "You're gonna break it",
                    hint: "Flip The Switch really fast",
                    points: 10,
                    goal: 10,
                    ...speedAchievement(GameEvent.THE_SWITCH_SWITCH)
                }
            ),
            ...createPack(AchievementPack.THE_BUTTON_PACK_1,
                {
                    id: 85,
                    name: "The wrong switch",
                    hint: "Press The Button with lights off",
                    points: 5,
                    events: {
                        [GameEvent.THE_BUTTON_CLICK]: () => {
                            if (!GameState.current.lightsOn) completeAchievement();
                        }
                    }
                },
                {
                    id: 86,
                    name: "My precious",
                    hint: "Try to steal The Button",
                    points: 5,
                    ...(function () {
                        let mouseDown = false;
                        return {
                            events: {
                                [GameEvent.THE_BUTTON_MOUSE_DOWN]: () => mouseDown = true,
                                [GameEvent.THE_BUTTON_MOUSE_UP]: () => mouseDown = false,
                                [GameEvent.THE_BUTTON_MOUSE_LEAVE]: () => {
                                    if (mouseDown) completeAchievement();
                                }
                            }
                        }
                    })()
                },
                {
                    id: 87,
                    name: "Sanic",
                    hint: "Click The Button really fast",
                    points: 10,
                    goal: 10,
                    ...speedAchievement(GameEvent.THE_BUTTON_CLICK)
                },
                {
                    id: 88,
                    name: "Liftoff",
                    hint: "Launch the rocket",
                    points: 25,
                    ...(function () {
                        let countdownPassed = false;
                        let justPassed = false;
                        return {
                            subscribe: () => Mousetrap.bind("9 8 7 6 5 4 3 2 1", () => {
                                countdownPassed = true;
                                justPassed = true;
                            }),
                            unsubscribe: () => Mousetrap.unbind("9 8 7 6 5 4 3 2 1"),
                            events: {
                                [GameEvent.KEY_UP]: () => {
                                    if (justPassed) {
                                        justPassed = false;
                                    }
                                    else {
                                        countdownPassed = false;
                                    }
                                },
                                [GameEvent.THE_BUTTON_CLICK]: () => {
                                    if (countdownPassed) {
                                        completeAchievement();
                                    }
                                }
                            }
                        }
                    })()
                },
            ),
            ...createPack(AchievementPack.MUSIC,
                {
                    id: 89,
                    name: "Memories",
                    hint: "Listen to nostalgic music",
                    points: 5,
                    events: {
                        [GameEvent.MUSIC_ON]: completeAchievement
                    }
                },
                {
                    id: 90,
                    name: "Permitted for non-profit",
                    hint: "Try to avoid copyright infringement",
                    points: 5,
                    events: {
                        [GameEvent.MUSIC_OFF]: completeAchievement
                    }
                }
            ),
            ...createPack(AchievementPack.GENERATOR,
                {
                    id: 91,
                    name: "Renewable Source",
                    hint: "Start generation of Achievement Points",
                    points: 1,
                    events: {
                        [GameEvent.GENERATOR_START]: completeAchievement
                    }
                }
            ),
            ...createPack(AchievementPack.REGRET,
                {
                    id: 92,
                    name: "Regret",
                    hint: "Feel regret",
                    points: 0,
                    events: {
                        [GameEvent.REGRET]: completeAchievement
                    }
                }
            ),
            ...createPack(AchievementPack.THE_END,
                {
                    id: 93,
                    name: "The End",
                    hint: "You have completed all achievements, yay!",
                    points: 0,
                    events: {
                        [GameEvent.THE_END]: completeAchievement
                    }
                }
            )
        ]
    }
}

function currentAchievement() {
    return <AchievementInfo>EventHub.game.currentTarget;
}

function completeAchievement() {
    currentAchievement().complete();
}

function keyPressAchievement(keys: string|string[]) {
    return {
        subscribe: (ach: AchievementInfo) => Mousetrap.bind(keys, () => ach.complete()),
        unsubscribe: () => Mousetrap.unbind(keys)
    }
}

function earnPointsAchievement(goal: number) {
    return {
        goal: goal,
        events: {
            [GameEvent.ACHIEVEMENT_POINTS_CHANGED]: (change: number) => {
                if (change > 0) {
                    currentAchievement().progress += change;
                }
            }
        }
    }
}

function spendPointsAchievement(goal: number) {
    return {
        goal: goal,
        events: {
            [GameEvent.ACHIEVEMENT_POINTS_CHANGED]: (change: number) => {
                if (change < 0) {
                    currentAchievement().progress += -change;
                }
            }
        }
    }
}

function achCountAchievement(goal: number) {
    return {
        goal: goal,
        events: {
            [GameEvent.ACHIEVEMENT_COMPLETED]: () => currentAchievement().progress++
        }
    }
}

function fizzBuzzAchievement(divisor: number) {
    return {
        events: {
            [GameEvent.UPDATE]: () => {
                if (Math.floor(Date.now() / (60 * 1000)) % divisor === 0) {
                    completeAchievement();
                }
            }
        }
    }
}

function mouseMoveAchievement(pixels: number) {
    return {
        goal: pixels,
        events: {
            [GameEvent.MOUSE_MOVE]: (e: MouseEvent) => {
                currentAchievement().progress += Math.sqrt(
                    e.movementX * e.movementX +
                    e.movementY * e.movementY
                );
            }
        }
    }
}

function upgradePurchaseAchievement(goal: number) {
    return {
        goal: goal,
        events: {
            [GameEvent.UPGRADE_PURCHASED]: () => currentAchievement().progress++
        }
    }
}

function playTimeAchievement(minutes: number) {
    return {
        goal: minutes * 60,
        events: {
            [GameEvent.UPDATE]: (delta: number) => currentAchievement().progress += delta
        }
    }
}

function abstentionAchievement(seconds: number) {
    return {
        goal: seconds,
        events: {
            [GameEvent.UPDATE]: (delta: number) => currentAchievement().progress += delta,
            [GameEvent.ACHIEVEMENT_COMPLETED]: () => currentAchievement().progress = 0,
        }
    }
}

function speedAchievement(procEvent: GameEvent, timePeriod: number = 3 * 1000) {
    let procTimestamps: number[] = [];

    function clicksPerSecond() {
        const now = Date.now();
        while (now - procTimestamps[0] > timePeriod) {
            procTimestamps.shift();
        }
        if (procTimestamps.length === 0) return 0;

        function lerp(from: number, to: number, fraction: number) {
            return from + (to - from) * fraction;
        }

        return procTimestamps
            .map(t => lerp(1, 0, (now - t) / timePeriod))
            .reduce((prev, curr) => prev + curr);
    }

    return {
        events: {
            [GameEvent.UPDATE]: () => {
                currentAchievement().progress = clicksPerSecond();
            },
            [procEvent]: () => {
                procTimestamps.push(Date.now());
                currentAchievement().progress = clicksPerSecond();
            }
        }
    }
}

function createPack(
    pack: AchievementPack,
    ...records: {
        id: number,
        name: string,
        hint?: string,
        hintVisible?: boolean,
        points: number,
        goal?: number,
        events?: { [event: string] : Function },
        subscribe?: Function,
        unsubscribe?: Function
    }[])
    : AchievementDataRecord[]
{
    return records.map(r => {
        return {
            pack: pack,
            ...r
        }
    });
}