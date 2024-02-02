window.addEventListener("load", init, false);

function init() {
  document.querySelector("#Bio").addEventListener("click", function () {
    aside_show("#BioChoices");
  });
  document.querySelector("#Photos").addEventListener("click", function () {
    aside_show("#PhotoChoices");
  });
  document.querySelector("#Discography").addEventListener("click", function () {
    aside_show("#DiscChoices");
  });
  document.querySelector("#Links").addEventListener("click", function () {
    aside_show("#LinkChoices");
  });
  document.querySelector("#Management").addEventListener("click", function () {
    aside_show("#ManagementChoices");
  });

  document.querySelector("#Style").addEventListener("click", function () {
    main_show("#mainStyle");
  });
  document.querySelector("#Members").addEventListener("click", function () {
    main_show("#mainMembers");
  });
  document.querySelector("#History").addEventListener("click", function () {
    main_show("#mainHistory");
  });
  document.querySelector("#Legacy").addEventListener("click", function () {
    main_show("#mainLegacy");
  });

  document.querySelector("#Concerts").addEventListener("click", function () {
    main_show("#mainPhotosConcerts");
  });
  document.querySelector("#Studio").addEventListener("click", function () {
    main_show("#mainPhotosStudio");
  });
  document.querySelector("#Videoclips").addEventListener("click", function () {
    main_show("#mainPhotosClips");
  });

  document.querySelector("#allAlbums").addEventListener("click", function () {
    getSongs(0);
    main_show("#mainDisc");
  });
  document.querySelector("#album1").addEventListener("click", function () {
    getSongs(2011);
    main_show("#mainDisc");
  });
  document.querySelector("#album2").addEventListener("click", function () {
    getSongs(2013);
    main_show("#mainDisc");
  });
  document.querySelector("#album3").addEventListener("click", function () {
    getSongs(2018);
    main_show("#mainDisc");
  });

  document.querySelector("#ManageMusic").addEventListener("click", function () {
    admingetSongs();
    main_show("#mainAdminDisc");
  });
  document
    .getElementById("adminSongsTable")
    .addEventListener("click", selectSong);
  document.getElementById("ButtonAddSong").addEventListener("click", addSong);
  document
    .getElementById("ButtonUpdateSong")
    .addEventListener("click", updateSong);
  document
    .getElementById("ButtonDeleteSong")
    .addEventListener("click", deleteSong);

  document.querySelector("#Music").addEventListener("click", function () {
    getLinksType("music");
    main_show("#mainLinks");
  });
  document.querySelector("#SocialMedia").addEventListener("click", function () {
    getLinksType("social");
    main_show("#mainLinks");
  });
  document
    .querySelector("#OfficialWebsite")
    .addEventListener("click", function () {
      getLinksType("officialwebsite");
      main_show("#mainLinks");
    });

  document.querySelector("#ManageLinks").addEventListener("click", function () {
    getLinks();
    main_show("#mainAdminLinks");
  });
  document.getElementById("LinksTable").addEventListener("click", selectLink);
  document.getElementById("ButtonAddLink").addEventListener("click", addLink);
  document
    .getElementById("ButtonUpdateLink")
    .addEventListener("click", updateLink);
  document
    .getElementById("ButtonDeleteLink")
    .addEventListener("click", deleteLink);

  aside_hideall();
  main_hideall();
}
const aside = [
  "#BioChoices",
  "#PhotoChoices",
  "#DiscChoices",
  "#LinkChoices",
  "#ManagementChoices",
];
const main = [
  "#mainStyle",
  "#mainMembers",
  "#mainHistory",
  "#mainLegacy",
  "#mainPhotosConcerts",
  "#mainPhotosStudio",
  "#mainPhotosClips",
  "#mainDisc",
  "#mainAdminDisc",
  "#mainAdminLinks",
  "#mainLinks",
];

function main_hideall() {
  var i;
  for (i = 0; i < main.length; i++) {
    const x = document.querySelector(main[i]);
    x.classList.add("hidden");
  }
}

function aside_hideall() {
  var i;
  for (i = 0; i < aside.length; i++) {
    const x = document.querySelector(aside[i]);
    x.classList.add("hidden");
  }
}

function aside_show(x) {
  console.log(x);
  aside_hideall();
  const y = document.querySelector(x);
  y.classList.remove("hidden");
}

function main_show(x) {
  console.log(x);
  main_hideall();
  const y = document.querySelector(x);
  y.classList.remove("hidden");
}

function admingetSongs() {
  fetch("/api/music", { method: "GET" })
    .then((res) => res.json())
    .then((json) => adminshowSongs(json))
    .catch((err) => console.error("error:", err));
}

function getSongs(x) {
  fetch("/api/music", { method: "GET" })
    .then((res) => res.json())
    .then((json) => showSongs(json, x))
    .catch((err) => console.error("error:", err));
}
function getFormData() {
  let aSong = {
    id: document.querySelector("#SongsForm [name='id']").value,
    album: document.querySelector("#SongsForm [name='album']").value,
    name: document.querySelector("#SongsForm [name='name']").value,
    releaseYear: document.querySelector("#SongsForm [name='release']").value,
  };
  return JSON.stringify(aSong);
}
function addSong() {
  let bodyData = getFormData();
  console.log(bodyData);
  fetch("/api/music", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      admingetSongs();
    })
    .catch((err) => alert("error:", err));
}

function updateSong() {
  let bodyData = getFormData();
  fetch("/api/music/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      admingetSongs();
    })
    .catch((err) => alert("error:", err));
}

function deleteSong() {
  let bodyData = getFormData();
  fetch("/api/music/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      admingetSongs();
    })
    .catch((err) => alert("error:", err));
}

function selectSong(event) {
  if (!event.target.outerHTML.startsWith("<td>")) return;
  let aRow = event.target.parentNode;
  let inputs = document.querySelectorAll("#SongsForm input");
  console.log(inputs.length);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = aRow.children[i].innerText;
    console.log(inputs[i].value);
  }
  let rows = [...aRow.parentNode.children];
  rows.forEach((r) => r.classList.remove("selected"));
  aRow.classList.add("selected");
}
function showSongs(Songs, x) {
  let anHTML = `<table><tr><th>Id</th>
      <th>Album</th><th>Name</th><th>ReleaseDate</th></tr>`;

  if (x == 0) {
    for (let aSong of Songs) {
      anHTML += `<tr>
        <td>${aSong.id}</td>
        <td>${aSong.album}</td>
        <td>${aSong.name}</td>
        <td>${aSong.releaseYear}</td>
        </tr>`;
    }
  } else {
    for (let aSong of Songs) {
      if (aSong.releaseYear == x) {
        anHTML += `<tr>
        <td>${aSong.id}</td>
        <td>${aSong.album}</td>
        <td>${aSong.name}</td>
        <td>${aSong.releaseYear}</td>
        </tr>`;
      }
    }
  }

  anHTML += "</table>";
  document.getElementById("SongsTable").innerHTML = anHTML;
}

function adminshowSongs(Songs) {
  let anHTML = `<table><tr><th>Id</th>
      <th>Album</th><th>Name</th><th>ReleaseDate</th></tr>`;

  for (let aSong of Songs) {
    anHTML += `<tr>
        <td>${aSong.id}</td>
        <td>${aSong.album}</td>
        <td>${aSong.name}</td>
        <td>${aSong.releaseYear}</td>
        </tr>`;
  }
  anHTML += "</table>";
  document.getElementById("adminSongsTable").innerHTML = anHTML;
}

/////////////////////////////////////////////////////////////////// data base code

function getLinks() {
  fetch("/api/links", { method: "GET" })
    .then((res) => res.json())
    .then((json) => showLinks(json))
    .catch((err) => console.error("error:", err));
}

function getLinksType(type) {
  fetch("/api/links/" + type, { method: "GET" })
    .then((res) => res.json())
    .then((json) => showLinksType(json))
    .catch((err) => console.error("error:", err));
}
function getFormData() {
  let aLink = {
    id: document.querySelector("#LinksForm [name='id']").value,
    name: document.querySelector("#LinksForm [name='name']").value,
    url: document.querySelector("#LinksForm [name='url']").value,
    type: document.querySelector("#LinksForm [name='type']").value,
  };
  return JSON.stringify(aLink);
}
function addLink() {
  let bodyData = getFormData();
  fetch("/api/links", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getLinks();
    })
    .catch((err) => alert("error:", err));
}

function updateLink() {
  let bodyData = getFormData();
  fetch("/api/links/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getLinks();
    })
    .catch((err) => alert("error:", err));
}

function deleteLink() {
  let bodyData = getFormData();
  fetch("/api/links/" + bodyData.id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: bodyData,
  })
    .then((res) => res.json())
    .then((json) => {
      alert(json);
      getLinks();
    })
    .catch((err) => alert("error:", err));
}

function selectLink(event) {
  if (!event.target.outerHTML.startsWith("<td>")) return;
  let aRow = event.target.parentNode;
  let inputs = document.querySelectorAll("#LinksForm input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = aRow.children[i].innerText;
  }
  let rows = [...aRow.parentNode.children];
  rows.forEach((r) => r.classList.remove("selected"));
  aRow.classList.add("selected");
}

function showLinks(Links) {
  let anHTML = `<table><tr><th>Id</th>
      <th>Name</th><th>URL</th><th>Type</th></tr>`;
  for (let aLink of Links) {
    anHTML += `<tr>
          <td>${aLink.id}</td>
          <td>${aLink.Name}</td>
          <td>${aLink.URL}</td>
          <td>${aLink.Type}</td>
          </tr>`;
  }
  anHTML += "</table>";
  //Show table with links
  document.getElementById("LinksTable").innerHTML = anHTML;
}

function showLinksType(Links) {
  let anHTML = `<table><tr><th>Id</th><th>URL</th></tr>`;
  for (let aLink of Links) {
    anHTML += `<tr>
          <td>${aLink.id}</td>
          <td><a href=${aLink.URL} target="_blank" rel="noopener noreferrer">${aLink.Name} </a></td>
          </tr>`;
  }
  anHTML += "</table>";
  //Show table with links
  document.getElementById("LinksTypeTable").innerHTML = anHTML;
}
