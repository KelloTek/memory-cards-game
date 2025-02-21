// Status game
let isStarted: boolean = false

// Table cards
let cards: Array<{name: string, image: string}> = [
    {name: "peach", image: "assets/images/card_peach.png"},
    {name: "peach", image: "assets/images/card_peach.png"},
    {name: "arrow", image: "assets/images/card_arrow.png"},
    {name: "arrow", image: "assets/images/card_arrow.png"},
    {name: "bee", image: "assets/images/card_bee.png"},
    {name: "bee", image: "assets/images/card_bee.png"},
    {name: "bell", image: "assets/images/card_bell.png"},
    {name: "bell", image: "assets/images/card_bell.png"},
    {name: "chicken", image: "assets/images/card_chicken.png"},
    {name: "chicken", image: "assets/images/card_chicken.png"},
    {name: "anvil", image: "assets/images/card_anvil.png"},
    {name: "anvil", image: "assets/images/card_anvil.png"},
    {name: "book", image: "assets/images/card_book.png"},
    {name: "book", image: "assets/images/card_book.png"},
    {name: "compass", image: "assets/images/card_compass.png"},
    {name: "compass", image: "assets/images/card_compass.png"},
    {name: "bread", image: "assets/images/card_bread.png"},
    {name: "bread", image: "assets/images/card_bread.png"}
]

// Card order list
let order: Array<number> = []

// Is match card ?
let isMatch: boolean = false

// Number of tries
const triesText = document.getElementById("tries") as HTMLElement
let tries: number = 0

// Number of cards completed
let completedCards: number = 0
let completedCardsMax: number = 9

// Previous card
let previousCard: string | null
let previousIndex: number | null
let previousCardContainer: HTMLElement

// Stopwatch
let totalSeconds: number = 0
let interval: ReturnType<typeof setInterval> | null = null

// Title
const gameTitle = document.getElementById("title") as HTMLElement

// When click on start button
const gameButton = document.getElementById("game-start") as HTMLElement
gameButton.addEventListener("click", () => {
    if(!isStarted) {
        gameStart()
        resetTimer()
        startTimer()
        tries = 0
        triesText.textContent = "Tries: " + tries
        gameTitle.textContent = "Match all cards"
        gameButton.textContent = "Start the Game"
        isStarted = true
    } else {
        gameTitle.textContent = "The game has already begun"
        setTimeout(() => {
            gameTitle.textContent = "Match all cards"
        }, 2000)
    }
})

const gameDiv = document.getElementById("game") as HTMLElement

// When initialization the game
function initGame(): void {
    gameDiv.innerHTML = ""

    cards.forEach(card => {
        const cardContainer = document.createElement("div") as HTMLElement
        cardContainer.classList.add("flex", "relative", "transition-all", "duration-500", "w-32", "h-32")

        cardContainer.innerHTML = `
            <div class="flex relative w-full hover:scale-110 transition-all duration-500">
                <img class="flex absolute w-full cursor-pointer transition-all duration-500" src="${card.image}" alt="Memory Card">
            </div>
        `

        gameDiv.appendChild(cardContainer)
    })
}

// At the start of the game
function gameStart(): void {
    gameDiv.innerHTML = ""

    let index: number = 0
    cards.forEach(card => {
        const cardContainer = document.createElement("div") as HTMLElement
        cardContainer.setAttribute("data-index", index.toString())
        cardContainer.setAttribute("data-name", card.name)
        cardContainer.setAttribute("data-return", "false")
        cardContainer.classList.add("flex", "relative", "transform-3d", "transition-all", "duration-500", "w-32", "h-32", "image-container")
        
        const randomOrder: number = getRandomExcluding(order)
        cardContainer.style.order = `${randomOrder}`
        order.push(randomOrder)

        cardContainer.innerHTML = `
            <div class="flex relative w-full hover:scale-110 transition-all duration-500">
                <img class="flex absolute w-full cursor-pointer backface-hidden flipped will-change-transform translate-3d transition-all duration-500 image-back" src="${card.image}" alt="Memory Card" data-order="2">
                <img class="flex absolute w-full cursor-pointer backface-hidden will-change-transform translate-3d transition-all duration-500 image-front" src="assets/images/card_back.png" alt="Memory Card" data-order="1">
            </div>
        `

        const cardImage = cardContainer.querySelector(`img[data-order="1"]`) as HTMLImageElement

        cardImage.addEventListener("click", () => {
            if(cardContainer.getAttribute("data-return") === "false" && !isMatch) {
                cardContainer.classList.toggle("flipped")

                if(previousCard) {
                    // When the first card is turned over
                    isMatch = true
                }

                if(!previousCard) {
                    // Return of the first card
                    previousCard = card.name

                    if(cardContainer.getAttribute("data-index") !== null){
                        previousIndex = parseInt(cardContainer.getAttribute("data-index") as string);
                    }

                    previousCardContainer = gameDiv.querySelector(`div[data-index="${previousIndex}"]`) as HTMLElement
                } else if(previousCard === card.name && previousIndex !== parseInt(cardContainer.getAttribute("data-index") as string)) {
                    // When correspondence cards
                    tries++
                    triesText.textContent = "Tries: " + tries

                    setTimeout(() => {
                        cardContainer.classList.add("grayscale")
                        previousCardContainer.classList.add("grayscale")

                        cardContainer.setAttribute("data-return", "true")
                        previousCardContainer.setAttribute("data-return", "true")

                        completedCards++

                        previousCard = null
                        previousIndex = null

                        isMatch = false

                        // When to win
                        if(completedCards === completedCardsMax) {
                            pauseTimer()
                            gameTitle.textContent = "You've won!"
                            // @ts-ignore
                            Swal.fire({
                                title: "You've won!",
                                text: "You've got a big brain! " + tries + " tries in " + timer.textContent,
                                icon: "success",
                                confirmButtonText: "Ok",
                                confirmButtonColor: "#38bdf8",
                                background: "#1f1f1f",
                                color: "#ffffff"
                            })
                            gameButton.textContent = "Restart the Game?"
                            order = []
                            completedCards = 0
                            isStarted = false
                        }
                    }, 500)
                } else {
                    // When cards do not match
                    tries++
                    triesText.textContent = "Tries: " + tries

                    setTimeout(() => {
                        cardContainer.classList.toggle("flipped")
                        previousCardContainer.classList.toggle("flipped")
                        
                        previousCard = null
                        previousIndex = null

                        isMatch = false
                    }, 500)
                }
            }
        })

        index++
        gameDiv.appendChild(cardContainer)
    })
}

// Random number with excluded numbers
function getRandomExcluding(excludedNumbers: Array<number>): number {
    const range = Array.from({ length: 18 }, (_, i) => i) as Array<number>
    const validNumbers = range.filter(num => excludedNumbers.indexOf(num) === -1) as Array<number>

    if(validNumbers.length === 0) {
        throw new Error("There aren't enough figures available!")
    }

    const randomIndex = Math.floor(Math.random() * validNumbers.length) as number
    return validNumbers[randomIndex]
}

// Timer
const timer = document.getElementById("timer") as HTMLElement

// Format time
function formatTime(totalSeconds: number) {
    let hours: number = Math.floor(totalSeconds / 3600)
    let minutes: number = Math.floor((totalSeconds % 3600) / 60)
    let seconds: number = totalSeconds % 60

    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
    ].join(":")
}

// Start timer
function startTimer() {
    if(!interval) {
        interval = setInterval(() => {
            totalSeconds++
            timer.textContent = formatTime(totalSeconds)
        }, 1000)
    }
}

// Pause timer
function pauseTimer() {
    if(interval) {
        clearInterval(interval)
        interval = null
    }
}

// Reset timer
function resetTimer() {
    pauseTimer()
    totalSeconds = 0
    timer.textContent = "00:00:00"
}

// Init the game
initGame()