import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { start } from "./server.js";

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
    this.jhimPt = Math.round(this.hp * (0.13));

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

  jhim(target) {
    target.hp -= target.jhimPt;
  }

}

class Player extends Character {

}

class Monster extends Character {
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

export function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
  // await가 붙는건 기다려준다 
  // await가 붙으려면 async가 필요하고
  // 비동기를 동기적인것 처럼 쓰려고! <- 가 목적
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
            3. 주화입마 : ${player.doubleatkProb * 100}% 확률로 2타
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
      case '1':
        player.attack(monster);
        logs.push(chalk.green(`${player.name}의 공격! ${monster.name}에게 ${player.atk} 타격!`));
        logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        monster.attack(player);
        logs.push(chalk.redBright(`${monster.name}의 공격! ${player.name}에게 ${monster.atk} 타격!`));
        logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소`))
        break;

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

      case '3':
        if (luk >= 1 - player.doubleatkProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 주화입마!"));
          player.doubleAtk(monster);
          logs.push(chalk.green(`${monster.name}에게 ` + (player.maxatk * 2) + `타격!`));
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        } else {
          logs.push(chalk.grey("어이쿠 손이 미끄러졌네! 주화입마에 실패!"));
          logs.push(chalk.green(`${monster.name}에게 ${player.atk} 타격!`));
          player.jhim(player)
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        }
        break;

      case '4':
        if (luk >= 1 - player.healProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 운기조식!"));
          player.heal(player);
          logs.push(chalk.blueBright(`${player.name}의 체력 ${player.healPt} 만큼 회복`));
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        } else {
          logs.push(chalk.grey("운기조식에 실패! 내상을 입었소!"));
          monster.jhim(player);
          logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소.`))
        }
        break;

      case '5':
        logs.push(chalk.green("삼십육계를 시도하오"));
        if (luk >= 0.5) {
          console.log(chalk.grey(Math.round(luk * 100), "% 확률로 성공! 2초 뒤 입구로 이동하오"));
          await delay(2);
          console.clear();
          start();
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

    // 5단계에서 시정잡배 잡고 나면 깬척하지만 사실 보스를 보게 하고싶다
    // 5단계가 아니라면 그냥 평범하게 스탯업 하는걸로

    console.log(stage, monster);

    if (stage === 5 && monster.name === "시정잡배" && monster.hp <= 0) {
      await delay(0.3);
      console.log(
        chalk.cyan(`${monster.name}, 격파하였 `) +
        chalk.yellowBright(`...어?`)
      );
      await delay(0.5);
      console.log(chalk.redBright(`큭 큭 큭`))
    } else if (stage !== 5 && monster.hp <= 0) {
      console.log(chalk.cyan(`${monster.name}, 격파하였소!`));

      // 플레이어 스탯업
      player.hp = 110 + Math.round(stage * 25);
      player.atk = 10 + Math.round(stage * 7.5);
      await delay(1);
    } 

    // 레벨별 스테이지 별도설정 - battle() 이 한번만 호출되도록
    if (stage === 5) {
     
      monster = new Monster("사파의 낭인", 200 + (stage * 15), 50 + (stage * 8));
      console.log(
        chalk.magenta(
          figlet.textSync('ROJIN', {
            font: 'Pagga',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      await battle(stage, player, monster);

    } else if (stage === 10) {
      monster = new Monster("쓰러져가는 폐인", 300 + (stage * 10), 100 + (stage * 10));
      console.log(
        chalk.magenta(
          figlet.textSync('PYE-IN', {
            font: 'Pagga',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      await battle(stage, player, monster);
    }

    // 스테이지 클리어 및 게임 종료 조건


    // 플레이어 사망
    if (player.hp <= 0) {
      console.log(chalk.red(`${player.name}은 쓰러졌다......\n`));
      console.log(
        chalk.gray(
          figlet.textSync('GAME OVER', {
            font: 'Pagga',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      console.log(chalk.cyan("\n========== 입구로 돌아가오 =========="));
      readlineSync.keyIn(`스페이스 바를 눌러주시오 `)
      start();
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
      readlineSync.keyIn(`\n 스페이스 바를 눌러주시오 `)
      await delay(2);
      start();
    }

    stage++;
  }
} 