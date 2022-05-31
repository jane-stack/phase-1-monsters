document.addEventListener("DOMContentLoaded", () => {
    const monsterContainer = document.getElementById("monster-container");
    const createMonster = document.getElementById("create-monster");
    const backButton = document.querySelector("#back");
    const forwardButton = document.querySelector("#forward");
    let pageNum = 1;
    const createButton = document.createElement("button");
    const form = document.createElement("form");
    
    fetchMonsters();
    createNewMonster();

    createButton.addEventListener("click", (e) => {
        e.preventDefault();
        const [name, age, description] = e.target.parentNode;
        // console.log("name", name.value);
        // console.log("age", age.value);
        // console.log("description", description.value);

        fetch('http://localhost:3000/monsters', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                age: age.value,
                description: description.value
            })
        })
        .then(response => response.json())
        .then(response => fetchMonsters(response))
        form.reset();
    })

    backButton.addEventListener("click", () => {
        if(pageNum === 1) {
            window.alert("No More Monsters Back Here")
        } else {
            pageNum -= 1;
            fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
            .then(response => response.json())
            .then ((monsters) => {
                // monsterContainer.innHTML = "" clears out the previous page.
                monsterContainer.innerHTML = `Page ${pageNum}`
                monsters.forEach((monster) => {
                    monsterContainer.append(renderMonster(monster), document.createElement("hr"))
                })
            })
        }
    })

    forwardButton.addEventListener("click", () => {
        pageNum += 1;
        fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
        .then(response => response.json())
        .then ((monsters) => {
            if (monsters.length === 0) {
                pageNum -= 1;
                window.alert("No More Monsters!")
            } else {
                monsterContainer.innerHTML = `Page ${pageNum}`
                monsters.forEach((monster) => {
                    monsterContainer.append(renderMonster(monster), document.createElement("hr"))
                })
            }
        })
    })

    function fetchMonsters() {
        fetch(`http://localhost:3000/monsters/?_limit=50&_page=${pageNum}`)
    .then(response => response.json())
    .then ((monsters) => {
        monsterContainer.innerHTML = `Page ${pageNum}`
        monsters.forEach((monster) => {
            monsterContainer.append(renderMonster(monster), document.createElement("hr"))
        })
    })

    }
    function renderMonster(monster) {
        const monsterSpan = document.createElement("span");
        monsterSpan.innerHTML = `
        <h1>${monster.name}</h1>
        <h4>Age: ${monster.age}</h4>
        <p>Description: ${monster.description}</p>
        `
        monsterSpan.setAttribute("data.id", monster.id);
        return monsterSpan;
    }

    function createNewMonster() {
        const nameInput = document.createElement("input");
        const ageInput = document.createElement("input");
        const bioInput = document.createElement("input");
        nameInput.placeholder = "NAME";
        ageInput.placeholder = "AGE";
        bioInput.placeholder = "DESCRIPTION";
        createButton.textContent = "CREATE MONSTER";
        form.append(nameInput, ageInput, bioInput, createButton);
        createMonster.append(form);
    }


})