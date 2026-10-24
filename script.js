
const form = document.getElementById("referralForm");
const list = document.getElementById("referralList");
const empty = document.getElementById("empty");
const message = document.getElementById("message");

let referrals = [];

try {
  referrals = JSON.parse(
    localStorage.getItem("carebridge-referrals") || "[]"
  );
} catch {
  referrals = [];
}

function save() {
  localStorage.setItem(
    "carebridge-referrals",
    JSON.stringify(referrals)
  );
}

function updateDashboard() {
  document.getElementById("total").textContent = referrals.length;
  document.getElementById("pending").textContent =
    referrals.filter(r => r.status === "Pending").length;
  document.getElementById("completed").textContent =
    referrals.filter(r => r.status === "Completed").length;
}

function render() {
  list.replaceChildren();
  empty.hidden = referrals.length > 0;

  referrals.forEach((r, index) => {
    const item = document.createElement("article");
    item.className = "referral";

    const heading = document.createElement("h3");
    heading.textContent = r.patient;

    const service = document.createElement("p");
    service.textContent = "Service: " + r.service;

    const date = document.createElement("p");
    date.textContent = "Follow-up date: " + r.date;

    const status = document.createElement("p");
    status.textContent = "Status: " + r.status;

    const overdue =
      r.status === "Pending" &&
      r.date < new Date().toLocaleDateString("en-CA");

    if (overdue) {
      const warning = document.createElement("p");
      warning.className = "overdue";
      warning.textContent = "Follow-up overdue";
      item.appendChild(warning);
    }

    item.append(heading, service, date, status);

    if (r.status === "Pending") {
      const button = document.createElement("button");
      button.textContent = "Mark Completed";

      button.addEventListener("click", () => {
        referrals[index].status = "Completed";
        save();
        render();
      });

      item.appendChild(button);
    }

    list.appendChild(item);
  });

  updateDashboard();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  referrals.push({
    patient: document.getElementById("patient").value.trim(),
    service: document.getElementById("service").value.trim(),
    date: document.getElementById("date").value,
    status: "Pending"
  });

  save();
  render();
  form.reset();
  message.textContent = "Referral added successfully.";
});

render();
