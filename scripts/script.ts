// Status game
let isStarted: boolean = false

// Table cards
let cards: Array<{name: string, image: string}> = [
    {name: "peach", image: "images/card_peach.png"},
    {name: "peach", image: "images/card_peach.png"},
    {name: "arrow", image: "images/card_arrow.png"},
    {name: "arrow", image: "images/card_arrow.png"},
    {name: "bee", image: "images/card_bee.png"},
    {name: "bee", image: "images/card_bee.png"},
    {name: "bell", image: "images/card_bell.png"},
    {name: "bell", image: "images/card_bell.png"},
    {name: "chicken", image: "images/card_chicken.png"},
    {name: "chicken", image: "images/card_chicken.png"},
    {name: "anvil", image: "images/card_anvil.png"},
    {name: "anvil", image: "images/card_anvil.png"},
    {name: "book", image: "images/card_book.png"},
    {name: "book", image: "images/card_book.png"},
    {name: "compass", image: "images/card_compass.png"},
    {name: "compass", image: "images/card_compass.png"},
    {name: "bread", image: "images/card_bread.png"},
    {name: "bread", image: "images/card_bread.png"}
]

// Card order list
let order: Array<number> = []

// Is match ?
let isMatch: boolean = false

// Number of cards completed
let completedCards: number = 0
let completedCardsMax: number = 9

// Previous card
let previousCard: string | null
let previousIndex: number | null
let previousCardContainer: HTMLElement

// Title
const gameTitle = document.getElementById("title") as HTMLElement

// When click on start button
const gameButton = document.getElementById("game-start") as HTMLElement
gameButton.addEventListener("click", () => {
    if(!isStarted) {
        gameStart()
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
                <img class="flex absolute w-full cursor-pointer backface-hidden flipped transition-all duration-500 image-back" src="${card.image}" alt="Memory Card" data-order="2">
                <img class="flex absolute w-full cursor-pointer backface-hidden transition-all duration-500 image-front" src="images/card_back.png" alt="Memory Card" data-order="1">
            </div>
        `

        const cardImage = cardContainer.querySelector(`img[data-order="1"]`) as HTMLImageElement

        cardImage.addEventListener("click", () => {
            if(cardContainer.getAttribute("data-return") === "false" && isMatch === false) {
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
                            gameTitle.textContent = "You've won!"
                            // @ts-ignore
                            Swal.fire({
                                title: "You've won!",
                                text: "You've got a big brain!",
                                icon: "success",
                                confirmButtonText: "Let's go!!!",
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

initGame()