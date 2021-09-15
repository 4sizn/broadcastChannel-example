import "./style.css";
import broadcast, { EventPayload } from "./broadcastChannel";

const isSupportBroadcastChannelEl = document.querySelector<HTMLSpanElement>(
	"#support-broadcast-channel"
);
const topic = "broadcast/";
const inputEl = document.querySelector<HTMLInputElement>("#text-input");
let isTyping = false;

(function () {
	if (!inputEl || !isSupportBroadcastChannelEl) return;

	isSupportBroadcastChannelEl.innerHTML = `BroadcastChannel을 ${
		broadcast.isSupport() ? "지원합니다." : "지원하지 않습니다."
	}`;

	if (!broadcast.isSupport()) {
		inputEl.setAttribute("disabled", "");
		return;
	}

	broadcast.subscribe(topic);

	inputEl.oninput = function () {
		broadcast.publish<EventPayload<string>>(topic, {
			eventName: "oninput",
			payload: inputEl.value,
		});
	};

	inputEl.onblur = function () {
		isTyping = false;
	};

	inputEl.onfocus = function () {
		isTyping = true;
	};

	if (broadcast.isSubscribed(topic)) {
		broadcast.on("oninput", (v: string) => {
			if (!isTyping) {
				inputEl.value = v;
			}
		});
	}
})();
