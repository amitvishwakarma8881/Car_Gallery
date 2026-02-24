const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");
const gallery = document.getElementById("gallery");
const fileInput = document.getElementById("fileInput");
const counter = document.getElementById("counter");
const addBtn = document.getElementById("addBtn");
const resetPreviewBtn = document.getElementById("resetPreviewBtn");
const uploadBox = document.querySelector(".upload-box");
const previewContainer = document.querySelector(".preview-container");
const sectionActions = document.getElementById("sectionActions");
const uploadSection = document.getElementById("uploadSection");
const sectionTitle = document.getElementById("sectionTitle");

let images = [
  { url: "car1.jpg", caption: "Mercedes", favourite:false, downloaded:false, deleted:false },
  { url: "car2.jpg", caption: "Audi", favourite:false, downloaded:false, deleted:false },
  { url: "car3.webp", caption: "Koenigsegg", favourite:false, downloaded:false, deleted:false },
  { url: "car4.jpg", caption: "Lamborghini", favourite:false, downloaded:false, deleted:false },
  { url: "car5.jpg", caption: "Lamborghini", favourite:false, downloaded:false, deleted:false },
  { url: "car6.jpg", caption: "Ferrari", favourite:false, downloaded:false, deleted:false },
  { url: "car7.jpg", caption: "Ferrari", favourite:false, downloaded:false, deleted:false },
  { url: "car8.jpg", caption: "Mercedes", favourite:false, downloaded:false, deleted:false },
  { url: "car9.jpg", caption: "Mercedes", favourite:false, downloaded:false, deleted:false },
  { url: "car10.jpg", caption: "Nissan", favourite:false, downloaded:false, deleted:false },
  { url: "car11.webp", caption: "Lamborghini", favourite:false, downloaded:false, deleted:false },
  { url: "car12.jpg", caption: "Mahindra", favourite:false, downloaded:false, deleted:false }
];

let currentSection = "dashboard";
let pendingFiles = [];

renderGallery();
updateCounter();
resetUploadPreview();
updateSidebarHighlight();

// ===== Sidebar toggle
openBtn.onclick = ()=>{ sidebar.classList.add("open"); overlay.classList.add("show"); };
closeBtn.onclick = ()=>{ sidebar.classList.remove("open"); overlay.classList.remove("show"); };
overlay.onclick = closeBtn.onclick;

// ===== Section switch
document.querySelectorAll(".sidebar button").forEach(btn=>{
  btn.onclick = ()=>{
    currentSection = btn.dataset.section;
    updateSidebarHighlight();
    renderGallery();
    uploadSection.style.display = (currentSection==="dashboard") ? "block" : "none";
    sectionTitle.textContent = btn.textContent;
    closeSidebar();
  };
});

function updateSidebarHighlight(){
  document.querySelectorAll(".sidebar button").forEach(btn=>{
    btn.classList.remove("current");
    if(btn.dataset.section===currentSection) btn.classList.add("current");
  });
}

// ===== Drag & Drop / Browse
uploadBox.onclick = ()=> fileInput.click();
uploadBox.addEventListener("dragover", e=>{ e.preventDefault(); uploadBox.style.borderColor="white"; });
uploadBox.addEventListener("dragleave", e=>{ uploadBox.style.borderColor="rgba(255,255,255,0.4)"; });
uploadBox.addEventListener("drop", e=>{ e.preventDefault(); uploadBox.style.borderColor="rgba(255,255,255,0.4)"; handlePreviewFiles(Array.from(e.dataTransfer.files)); });
fileInput.addEventListener("change", e=> handlePreviewFiles(Array.from(e.target.files)));

function handlePreviewFiles(files){
  if(files.length>5){ alert("Max 5 images at a time!"); return; }
  pendingFiles = files;
  previewContainer.innerHTML = "";
  files.forEach(file=>{
    const reader = new FileReader();
    reader.onload = e=>{
      const img = document.createElement("img");
      img.src = e.target.result;
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

addBtn.onclick = ()=>{
  pendingFiles.forEach(file=>{
    const url = URL.createObjectURL(file);
    const caption = file.name.replace(/\.[^/.]+$/,"");
    images.push({ url, caption, favourite:false, downloaded:false, deleted:false });
  });
  resetUploadPreview();
  updateCounter();
  renderGallery();
};

resetPreviewBtn.onclick = resetUploadPreview;

function resetUploadPreview(){
  pendingFiles=[];
  previewContainer.innerHTML="";
  uploadBox.innerHTML="<p>Drag & Drop or Click to Upload (Max 5)</p><div class='preview-container'></div>";
}

function updateCounter(){
  const uploaded = images.length-12;
  counter.textContent = `${uploaded} image(s) uploaded`;
}

// ===== 3-dot menu outside click
document.addEventListener("click", ()=>{ document.querySelectorAll(".menu").forEach(m=>m.style.display="none"); });

// ===== Render Gallery
function renderGallery(){
  gallery.innerHTML="";
  sectionActions.innerHTML="";

  const filtered = images.filter(img=>{
    if(currentSection==="dashboard") return !img.deleted;
    if(currentSection==="favourites") return img.favourite && !img.deleted;
    if(currentSection==="downloads") return img.downloaded && !img.deleted;
    if(currentSection==="deleted") return img.deleted;
  });

  if(filtered.length===0){
    const msg = document.createElement("div");
    msg.style.textAlign="center";
    msg.style.margin="30px";
    msg.style.fontSize="18px";
    msg.textContent="This section is empty!";
    gallery.appendChild(msg);
    return;
  }

  // Section action buttons
  if(currentSection==="favourites"){
    const btn = document.createElement("button");
    btn.textContent="Remove All from Favourites";
    btn.onclick = ()=>{ images.forEach(img=>img.favourite=false); renderGallery(); };
    sectionActions.appendChild(btn);
  }
  if(currentSection==="downloads"){
    const btn = document.createElement("button");
    btn.textContent="Remove All from Downloads";
    btn.onclick = ()=>{ images.forEach(img=>img.downloaded=false); renderGallery(); };
    sectionActions.appendChild(btn);
  }
  if(currentSection==="deleted"){
    const clearBtn = document.createElement("button");
    clearBtn.textContent="Clear Bin";
    clearBtn.onclick = ()=>{ images = images.filter(img=>!img.deleted); renderGallery(); };
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent="Restore All";
    restoreBtn.onclick = ()=>{ images.forEach(img=>{ if(img.deleted) img.deleted=false; img.favourite=false; }); renderGallery(); };
    sectionActions.appendChild(clearBtn);
    sectionActions.appendChild(restoreBtn);
  }

  // Render cards
  filtered.forEach(img=>{
    const figure = document.createElement("figure");
    figure.className="card";

    const image = document.createElement("img"); image.src=img.url;
    const caption = document.createElement("figcaption"); caption.textContent=img.caption;

    const menuBtn = document.createElement("button"); menuBtn.className="menu-btn"; menuBtn.textContent="⋮";
    const menu = document.createElement("div"); menu.className="menu"; menu.addEventListener("click", e=> e.stopPropagation());

    function addItem(text, action){ const btn=document.createElement("button"); btn.textContent=text; btn.onclick=()=>{ action(); menu.style.display="none"; renderGallery(); }; menu.appendChild(btn); }

    if(currentSection==="dashboard"){
      addItem("⭐ Add to Favourite", ()=> img.favourite=true);
      addItem("⬇ Download", ()=> img.downloaded=true);
      addItem("🗑 Delete", ()=> img.deleted=true);
      addItem("✏ Edit Caption", ()=>{ const newCaption = prompt("Edit caption:", img.caption); if(newCaption!==null) img.caption=newCaption.trim(); });
    }
    if(currentSection==="favourites"){
      addItem("❌ Remove Favourite", ()=> img.favourite=false);
      addItem("⬇ Download", ()=> img.downloaded=true);
      addItem("✏ Edit Caption", ()=>{ const newCaption = prompt("Edit caption:", img.caption); if(newCaption!==null) img.caption=newCaption.trim(); });
    }
    if(currentSection==="downloads"){
      addItem("⬇ Download Again", ()=> img.downloaded=true);
    }
    if(currentSection==="deleted"){
      addItem("♻ Restore", ()=>{ img.deleted=false; img.favourite=false; });
      addItem("✏ Edit Caption", ()=>{ const newCaption = prompt("Edit caption:", img.caption); if(newCaption!==null) img.caption=newCaption.trim(); });
    }

    menuBtn.onclick = e=>{ e.stopPropagation(); document.querySelectorAll(".menu").forEach(m=>{ if(m!==menu) m.style.display="none"; }); menu.style.display = menu.style.display==="flex"?"none":"flex"; };

    figure.appendChild(image);
    figure.appendChild(caption);
    figure.appendChild(menuBtn);
    figure.appendChild(menu);
    gallery.appendChild(figure);
  });
}