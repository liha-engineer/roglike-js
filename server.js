import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { startGame } from "./game.js";
import { delay } from "./game.js";

export async function movingText(text, fontStyle, textColor, sec) {
    let titleText = "";
    for (let i = 0; i < text.length; i++) {
        console.clear();
        titleText = text.slice(text.length - i - 1, text.length)
        console.log(textColor(figlet.textSync(titleText, {
            font: fontStyle,
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
        })));

        await delay(sec);
    }
}

// 로비 화면을 출력하는 함수
async function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    // console.log(
    //     chalk.cyan(
    //         figlet.textSync('MUGEUNBON', {
    //             font: 'Elite',
    //             horizontalLayout: 'fitted',
    //             verticalLayout: 'fitted',
    // //         })
    //     )
    // );

    // 움직이는 타이틀 텍스트

    await movingText("MUGEUNBON", "Elite", chalk.cyan, 0.5);

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('주화입마의 세계로 떠나는 무근본 몹 척살기'));

    // 설명 텍스트
    console.log(chalk.green('아래에서 선택해주시게'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 여정 떠나기'));
    console.log(chalk.blue('2.') + chalk.white(' 무림 명예의 전당'));
    console.log(chalk.blue('3.') + chalk.white(' 설정'));
    console.log(chalk.blue('4.') + chalk.white(' 사바세계로 귀환'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('번호를 선택한 후 엔터를 누르시게'));
}

// 유저 입력을 받아 처리하는 함수
async function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작하오'));
            // 여기에서 새로운 게임 시작 로직을 구현
            await startGame();
            break;
        case '2':
            console.log(chalk.yellow('구현 준비중이오... 내공이 부족하오'));
            // 업적 확인하기 로직을 구현
            await handleUserInput();
            break;
        case '3':
            console.log(chalk.blue('구현 준비중이오... 내공이 부족하오'));
            // 옵션 메뉴 로직을 구현
            await handleUserInput();
            break;
        case '4':
            console.log(chalk.red('사바세계로 돌아가오'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하시게'));
            await handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
export async function start() {
    await displayLobby();
    await handleUserInput();
}

// 게임 실행
await start();