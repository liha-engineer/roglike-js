import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { start } from "./server.js";
import { movingText } from "./server.js";

class Character {
  constructor(name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;

    this.dfsProb = 0.6;
    this.doubleatkProb = 0.4;
    this.runProb = 0.5;
    this.healProb = 0.3;

    this.maxatk = Math.round(atk * 1.4);
    this.dfs = Math.round(atk * 0.4);
    this.healPt = Math.round(this.hp * (0.2));
    this.jhimPt = Math.round(this.hp * (0.1));

  }

  // hp와 atk()가 공통이니 뽑는것도?
  // this.을 붙여서 상태처럼 쓸 필요는 없다!
  // 그냥 데미지를 리턴하고 그 값을 hp에서 빼는 것도 가능!
  // 지금같은 구현이라면 바깥에서 데미지를 카운트해주는 무언가가 필요할것!
  // 함수 한개로 음수면 데미지, 양수면 힐로 구현할 수 있을 것! 

  attack(target) {
    const damage = this.atk;
    target.hp -= damage;
  }

  doubleAtk(target) {
    const damage = (this.maxatk * 2);
    target.hp -= damage;
  }

  defense(target) {
    this.hp = this.hp - target.atk + this.dfs;
  }

  heal(target) {
    target.hp += target.healPt;
  }

  // 주화입마  - 운기조식 실패 시 내상입는 용도. 체력의 10% 까임
  jhim(target) {
    target.hp -= target.jhimPt;
  }

}

class Player extends Character {

}

class Monster extends Character {
}

export function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
  // await가 붙는건 기다려준다 
  // await가 붙으려면 async가 필요하고
  // 비동기를 동기적인것 처럼 쓰려고! <- 가 목적
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n======== Current Status =======`));
  console.log(
    chalk.cyanBright(` | Stage: ${stage} \n`),
    chalk.blueBright(
      `| [${player.name}] 체력: ${player.hp} 내공: ${player.atk} \n`,
    ),
    chalk.redBright(
      `| [${monster.name}] 체력: ${monster.hp} 내공: ${monster.atk} `,
    )
  );
  console.log(chalk.magentaBright(`===============================\n`));
}

// const battleMenu = async (player, monster, choice) => {
// }

const battle = async (stage, player, monster) => {
  let logs = [];
  let turncnt = 0;
  logs.push(chalk.gray(`---------- 신규 스테이지 시작 ----------`));

  // 5, 10 스테이지를 특별보스로 구성하고 싶어요!
  // 그러면 while문을 더 써야할것 같은데... -> 이게 아니다!

  while (stage <= 10 && player.hp > 0) {
    let luk = Math.random();
    turncnt++;

    console.clear();
    displayStatus(stage, player, monster);

    logs.push(chalk.green(`\n`));
    logs.forEach((log) => console.log(log));

    if (monster.hp < 1) { break; }
    if (player.hp < 1) { break; }

    console.log(
      chalk.green(
        `\n 
            1. 선풍각   : 기본 공격 
            2. 천산갑   : ${player.dfsProb * 100}% 확률로 방어
            3. 초풍신권 : ${player.doubleatkProb * 100}% 확률로 2타
            4. 운기조식 : ${player.healProb * 100}% 확률로 회복
            5. 삼십육계 : ${player.runProb * 100}% 확률로 도망
            `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 이름이 깨지는건 인코딩 설정의 문제 -> EUC - KR로 바꿔볼까?

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.magenta(`${choice} 번을 선택했구려`));
    logs.push(chalk.gray(`---------- 선택 완료 ----------`));

    switch (choice) {

      //일반공격(선풍각)
      case '1':
        player.attack(monster);
        logs.push(chalk.green(`${player.name}의 공격! ${monster.name}에게 ${player.atk} 타격!`));
        logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        monster.attack(player);
        logs.push(chalk.redBright(`${monster.name}의 공격! ${player.name}에게 ${monster.atk} 타격!`));
        logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소`))
        break;

      //방어(천산갑)
      case '2':
        if (luk >= 1 - player.dfsProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 천산갑!"));
          player.defense(monster);
          logs.push(chalk.redBright(`${monster.name}의 공격을 방어! ${player.name}에게 ` + (monster.atk - player.dfs) + ` 타격!`));
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        } else {
          logs.push(chalk.grey("천산갑에 실패!"));
          monster.attack(player);
          logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 타격!`));
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        }
        break;

      //2타공격(초풍신권)
      case '3':
        if (luk >= 1 - player.doubleatkProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 초풍신권!"));
          logs.push(chalk.magenta(`내공이 온 몸에 넘쳐흘러 적에게 타격을 입지 않소`));
          player.doubleAtk(monster);
          logs.push(chalk.green(`${monster.name}에게 ${(player.maxatk * 2)} 타격!`));
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        } else {
          logs.push(chalk.grey("어이쿠 손이 미끄러졌네! 초풍신권 대신 빅장을 날리오"));
          player.attack(monster);
          monster.attack(player);
          logs.push(chalk.green(`${monster.name}에게 ${player.atk} 타격!`));
          logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 타격!`));
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        }
        break;

      // 회복(운기조식)
      case '4':
        if (luk >= 1 - player.healProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 운기조식!"));
          player.heal(player);
          logs.push(chalk.blueBright(`${player.name}의 체력 ${player.healPt} 만큼 회복`));
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        } else {
          // 회복 실패 시 대미지
          logs.push(chalk.grey("운기조식에 실패! 내상을 입었소!"));
          monster.jhim(player);
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        }
        break;

      case '5':
        logs.push(chalk.green("삼십육계를 시도하오"));
        if (luk >= 0.5) {
          console.log(chalk.grey(Math.round(luk * 100), "% 확률로 성공! 2초 뒤 입구로 이동하오"));
          await delay(2);

          // start() 함수 호출하여 새 게임 들어갈 때 자꾸 이전 로그가 남아있어서 초기화 시도
          logs = [];
          await start();

        } else {
          logs.push(chalk.grey(Math.round(luk * 100), "% 확률로 실패! 적에게 발각!"));
          monster.attack(player);
          logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 타격!`));
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        }
        break;

      default:
        logs.push(chalk.red('올바른 번호를 선택해주시오'));
        break;
    }

    logs.push(chalk.gray(`---------- ${turncnt} 번째 턴 ----------`));

  }
};


export async function startGame() {
  console.clear();
  console.log(chalk.grey(`\n======================= 서 두 ======================\n`));
  console.log(chalk.grey(`무림의 어느 민가에서 며칠만에 깨어난 당신`));
  await delay(0.5);
  console.log(chalk.grey(`강에 버려진 당신을 아들이 발견했다는 아낙의 말에`));
  await delay(0.5);
  console.log(chalk.grey(`당신과 함께 떠내려왔다는 보따리를 급히 열어본다`));
  await delay(0.5);
  console.log(chalk.grey(`그 곳에는 물에 젖지 않은 서책 한 권이 있었고`));
  await delay(0.5);
  console.log(chalk.grey(`책을 펼쳐본 당신은 알 수 없는 기운을 느끼는데...`));
  await delay(0.5);
  console.log(chalk.grey(`\n=====================================================\n`));
  const playerName = readlineSync.question(chalk.grey(`이름을 알려주시겠소?(영어, 숫자) `));

  const player = new Player(`${playerName}`, 110, 10);
  let stage = 1;

  while (stage <= 10) {

    // 이 monster가 상단에 한개는 선언되어야 스테이지 클리어/게임 클리어 if구문이 인자를 받을 수 있다.
    let monster = new Monster("시정잡배", 50 + ((stage - 1) * 20), 10 + ((stage - 1) * 10));
    await battle(stage, player, monster);

    // 5, 10단계에서 시정잡배 잡고 나면 깬척하지만 사실 보스를 보게 하고싶다
    // 해당 단계가 아니라면 그냥 평범하게 스탯업 하는걸로...
    // 레벨별 스테이지 별도설정 - battle() 이 한번만 호출되도록

    if (stage === 5 && monster.name === "시정잡배" && monster.hp <= 0) {

      console.log(chalk.cyan(`${monster.name}, 격파하였소! `));
      await delay(3);
      console.log(chalk.yellowBright(`...어?\n`));
      await delay(1);

      // 큭x6 띄우기
      const keuk = chalk.redBright(`큭 `.repeat(6));
      console.log(keuk);
      await delay(1);

      console.log(
        chalk.grey(
          `\n기분 나쁜 웃음 소리와 함께 
        \n섬뜩한 인기척이 느껴진다
        \n정신을 다잡고 운기조식을...!!\n`
        ));
      await delay(3);

      player.hp += 200;
      player.atk += 20;

      await movingText(`\n \n \nR O J I N`, "Pagga", chalk.magentaBright, 0.2);
      await delay(1);

      monster = new Monster("사파의 낭인", 200 + (stage * 15), 50 + (stage * 5));
      await battle(stage, player, monster);

    } else if (stage === 10 && monster.name === "시정잡배" && monster.hp <= 0) {

      console.log(
        chalk.cyan(`${monster.name}, 격파하였 `) +
        chalk.yellowBright(`...을 리가 없지 그래\n`));
      await delay(3);

      console.log(
        chalk.magentaBright(`\n이젠 나도 당하고만 있을 수 없어\n`)
      )
      await delay(3);

      console.clear();

      console.log(
        chalk.greenBright(`${player.name}은 팔맥교회혈을 점혈합니다\n\n`)
      );

      await delay(3);

      player.hp += (stage * 20);
      player.atk += (stage * 10);


      // 깔x6 띄우기
      const kkal = chalk.redBright(`깔 `.repeat(6));
      console.log(kkal);
      await delay(3);

      console.log(
        chalk.red(
          `\n 노력은 가상하다만,
            \n 명계로 가는 시간만 단축 할 뿐
        `));
      await delay(3);

      await movingText(`\n \n \nP Y E - I N`, "Pagga", chalk.redBright, 0.3);
      await delay(1);

      monster = new Monster("쓰러져가는 폐인", 300 + (stage * 10), 100 + (stage * 10));
      await battle(stage, player, monster);

    }

    if (monster.hp <= 0) {
      console.log(chalk.cyan(`${monster.name}, 격파하였소!`));

      // 플레이어 스탯업
      player.hp = 110 + Math.round(stage * 23);
      player.atk = 10 + Math.round(stage * 7.7);
      await delay(1);
    }

    // 스테이지 클리어 및 게임 종료 조건


    // 플레이어 사망
    if (player.hp <= 0) {
      console.log(
        chalk.red(`${player.name}은 쓰러졌다......\n`) +
        chalk.grey(`
          아득해지는 감각 너머로 \n
          ${monster.name}의 비웃음 소리가 \n
          귓전에 소용돌이 친다......`)

      );
      await delay(1);

      console.log(
        chalk.gray(
          figlet.textSync('GAME OVER', {
            font: 'Pagga',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      await delay(1);

      console.log(chalk.cyan("\n========== 입구로 돌아가오 =========="));
      readlineSync.keyIn(`스페이스 바를 눌러주시오 `);
      await delay(3);
      await start();

    }

    // 10 스테이지까지 올클리어
    if (stage === 10 && monster.hp <= 0) {
      console.log(chalk.cyan("========== ALL STAGE CLEAR =========="));
      console.log(
        chalk.cyan(
          figlet.textSync('CLEAR', {
            font: 'Henry 3D',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      console.log(chalk.cyan("========== 입구로 돌아가오 =========="));
      readlineSync.keyIn(`\n 스페이스 바를 눌러주시오 `);
      await delay(3);
      await start();

    }

    stage++;
  }
} 