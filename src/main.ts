import "./style.css";
import broadcast from "./broadcastChannel";

const isSupportBroadcastChannelEl = document.querySelector<HTMLSpanElement>(
	"#support-broadcast-channel"
)!;

const topic = "broadcast/test";

const inputEl = document.querySelector<HTMLInputElement>("#text-input");

isSupportBroadcastChannelEl.innerHTML = `BroadcastChannel을 ${
	broadcast.isSupport() ? "지원합니다." : "지원하지 않습니다."
}`;

if (broadcast.isSupport()) {
	broadcast.subscribe(topic);
} else {
	inputEl?.setAttribute("disabled", "");
}

inputEl.oninput = function () {
	broadcast.send(topic, inputEl?.value);
	console.log(inputEl?.value);
};
