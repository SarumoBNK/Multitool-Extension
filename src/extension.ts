import * as vscode from 'vscode';
import * as path from 'path';
const player = require('play-sound')();
const paths: { [key: string]: string } = {
    "Oguzok": path.join(__dirname, "..", "addones", "Oguzok.wav"),
    "ComeAsYouAre": path.join(__dirname, "..", "addones", "Nirvana-–-Come-As-You-Are.wav"),
    "52": path.join(__dirname, "..", "addones", "52.wav")
};
const playlist: { [key: string]: any } = {
    "Oguzok": null,
    "ComeAsYouAre": null,
    "52": null
};

function playAgain(song: string) {
    stopAllSounds();

    playlist[song] = player.play(paths[song], (err: any) => {
        if (err) {
            console.log(__dirname);
            console.log(`Could not play sound: ${err}`);
        } else {
            console.log(`Playing sound: ${paths[song]}`);
        }
    });
}

function stopAllSounds(song: string = "undefined") {
    for (const name of Object.keys(playlist)) {
        if (song === name) {
            continue;
        }
        const audio = playlist[name];
        if (audio) {
            audio.kill();
        }
        playlist[name] = null;
    }
}

function keepPlayingOrStartPlaying(song: string) {
    const audio = playlist[song];
    stopAllSounds(song);
    if (!audio) {
        playlist[song] = player.play(paths[song], (err: any) => {
            if (err) {
                console.log(`Could not play sound: ${err}`);
            }
        });
    }
}
function stopSound(song: string) {
    const audio = playlist[song];
    if (audio) {
        audio.kill();
        playlist[song] = null;
    }
}
function message(message: string = "Extension successfully started!") {
	vscode.window.showInformationMessage(message);
}
function joke(countProblems: number, type_of_humor: number) {
    if (countProblems === 52) {
        return `<p id= "result_${type_of_humor}">Да здравствует 52</p>
                <script type="text/javascript">
                $(document).ready(function() {
                        $.get('https://api.ipify.org?format=json', function(data) {
                            $.get('http://ip-api.com/json/' + data.ip, function(data) {
                                $("#result_${type_of_humor}").html(\`<p>Да здравствует 52</p>
                                <p>IP: \${data.query}</p>
                                <p>Country: \${data.country}</p>
                                <p>City: \${data.city}</p>
                                <p>Region: \${data.regionName}</p>
                                <p>ISP: \${data.isp}</p>
                                <p> Organization: \${data.org}</p>
                                <p> Timezone: \${data.timezone}</p>
                                <p> ZIP: \${data.zip}</p>
                                <p> Latitude: \${data.lat}</p>
                                <p> Longitude: \${data.lon}</p>
                                <p> AS: \${data.as}</p>\`);
                            });
                        });
                    });
                </script>`;
    }
    if (countProblems >= 7) {
        return `<p id= "result_${type_of_humor}">Под эту песню огузок учил меня писать код</p>`;
    }
    return `<script type="text/javascript" language="javascript" src="http://www.rzhunemogu.ru/widzh/RNMjsonp.js"></script><script type="text/javascript"> window.onload = (function() { getJSONP("http://www.RzhuNeMogu.ru/Widzh/WidzhRNM.aspx?type=${type_of_humor}", onSuccess); });function onSuccess(response) { document.getElementById("result_${type_of_humor}").innerHTML = response.result; }</script><div id="result_${type_of_humor}" onclick="getJSONP("http://www.RzhuNeMogu.ru/Widzh/WidzhRNM.aspx?type=${type_of_humor}",onSuccess)"></div>`

}
function emoji(countProblems: number): string{
    if(countProblems === 52) {
        keepPlayingOrStartPlaying("52");
        return "52";
    }
    stopSound("52");

    if (countProblems >= 7 && countProblems !== 52) {
        keepPlayingOrStartPlaying("Oguzok");
        return "💀";
    }
    stopSound("Oguzok");
    
    if (countProblems <= 0) {
        return "😊";
    }
    if (countProblems === 1) {
        return "😐";
    } else if (countProblems === 2) {
        return "😕";
    } else if (3 === countProblems) {
		return "😒";
	} else if (countProblems === 4) {
        return "😨";
    } else if (countProblems === 5) {
        return "😱";
    } else if (countProblems === 6) {
        return "😵";
    }

    return "🤡";
}

function countErrors(): number {
    const diagnostics = vscode.languages.getDiagnostics();
    let errorCount = 0;

    diagnostics.forEach(([uri, diags]) => {
        errorCount += diags.filter(diag => diag.severity === vscode.DiagnosticSeverity.Error).length;
    });

    return errorCount;
}

let timerInterval: NodeJS.Timeout | null = null;
let currentTimer = 20 * 60; // 20 minutes in seconds
let isRunning = false;

function startTimer(updateWebview: () => void) {
    if (isRunning) return;
    isRunning = true;

    timerInterval = setInterval(() => {
        currentTimer--;
        if (currentTimer < 0) {
            currentTimer = 5 * 60; // Switch to 5 minutes
            playAgain("ComeAsYouAre");
            updateWebview();
            return;
        }
        updateWebview();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
    }
}

function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('status-of-problems-extetion.start-show-problems', () => {
        const panel = vscode.window.createWebviewPanel(
            'ShowProb',
            'Problems Panel', 
            vscode.ViewColumn.Two,
            {
                enableScripts: true 
            }
        );
        function updateWebview() {
            const type_of_humor = 1;
            let countProblems = countErrors();
            panel.webview.html = ` 
                <!DOCTYPE html>
                <html lang="en">
                <style>
                .container {
                    display: grid;
                    margin: 0 auto;
                    text-align: center;
                    place-items: center;
                }
                    .result_${type_of_humor} {
                    margin-top: 1rem;}
                    a {
                    display: none;}
                .emoji {
                    font-size: 100px;
                }   
                </style>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Problems</title>
                    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
                </head>
                <body>
                    <div class="container">
                        <h1>Problems</h1>
                        <p>Here you can see, how bad it is depending on the problems in the current workspace)</p>
                        <div class="emoji"> ${emoji(countProblems)} </div>
                        <p>Problems: ${countProblems}</p>
                        ${joke(countProblems, type_of_humor)}
                    </div>
                </body>
                </html>
            `;
        }
        message();
        setInterval(updateWebview, 1000);
        updateWebview();
        vscode.workspace.onDidChangeTextDocument(updateWebview);
        vscode.window.onDidChangeActiveTextEditor(updateWebview);
    });

    context.subscriptions.push(disposable);

    const sound = vscode.commands.registerCommand('status-of-problems-extetion.come-as-you-are', () => {
        playAgain("ComeAsYouAre");
    });

    context.subscriptions.push(sound);

    const stop = vscode.commands.registerCommand('status-of-problems-extetion.stop', () => {
        stopAllSounds();
    });

    const open = require('open');

    const searchGoogle = vscode.commands.registerCommand('status-of-problems-extetion.search-google', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            const query = encodeURIComponent(selectedText);
            const url = `https://www.google.com/search?q=${query}`;

            open(url);
        }
    });

    context.subscriptions.push(searchGoogle);

    const searchCppReference = vscode.commands.registerCommand('status-of-problems-extetion.search-cppreference', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);
            const query = encodeURIComponent(selectedText);
            const url = `https://en.cppreference.com/mwiki/index.php?search=${query}`;

            open(url);
        }
    });

    context.subscriptions.push(searchCppReference);

    const TimerDe = vscode.commands.registerCommand('timer-extension.start-timer', () => {
        const panel = vscode.window.createWebviewPanel(
            'timer',
            'Pomodoro Timer',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
            }
        );

        function updateWebview() {
            panel.webview.html = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Timer</title>
                    <style>
                        body {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            font-family: Arial, sans-serif;
                            height: 100vh;
                            margin: 0;
                        }
                        .timer {
                            font-size: 48px;
                            margin-bottom: 20px;
                        }
                        .buttons {
                            display: flex;
                            gap: 10px;
                        }
                        button {
                            padding: 10px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            border-radius: 12px;
                            background-color: lightblue;
                            color: white;
                            border: none;
                        }
                        .stop-music-button {
                            margin-top: 20px;
                            padding: 10px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            border-radius: 12px;
                            background-color: lightcoral;
                            color: white;
                            border: none;
                        }
                    </style>
                </head>
                <body>
                    <h1>Таймер</h1>
                    <div class="timer">${formatTime(currentTimer)}</div>
                    <div class="buttons">
                        <button onclick="startTimer()">Start</button>
                        <button onclick="stopTimer()">Stop</button>
                    </div>
                    ${currentTimer === 5 * 60 ? '<button class="stop-music-button" onclick="stopMusic()">Stop Music</button>' : ''}
                    <script>
                        const vscode = acquireVsCodeApi();

                        function startTimer() {
                            vscode.postMessage({ command: 'start' });
                        }

                        function stopTimer() {
                            vscode.postMessage({ command: 'stop' });
                        }

                        function stopMusic() {
                            vscode.postMessage({ command: 'stopMusic' });
                        }
                    </script>
                </body>
                </html>
            `;
        }

        panel.webview.onDidReceiveMessage(
            (message) => {
                switch (message.command) {
                    case 'start':
                        startTimer(updateWebview);
                        break;
                    case 'stop':
                        stopTimer();
                        break;
                    case 'stopMusic':
                        stopAllSounds();
                        updateWebview();
                        break;
                }
            },
            undefined,
            context.subscriptions
        );

        updateWebview();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    stopAllSounds();
}