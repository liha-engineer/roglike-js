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

    this.defenseProb = 0.6;
    this.doubleatkProb = 0.4;
    this.runProb = 0.5;
    this.healProb = 0.3;

    this.maxatk = Math.round(atk * 1.4);
    this.defensePt = Math.round(atk * 0.3);
    this.healPt = Math.round(this.hp * (0.2));
    this.jhimPt = Math.round(this.hp * (0.1));

  }

  attack(target) {
    const damage = this.atk;
    target.hp -= damage;
  }

  doubleAtk(target) {
    const damage = (this.maxatk * 2);
    target.hp -= damage;
  }

  defense(target) {
    this.hp = this.hp - target.atk + target.defensePt;
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

export const delay = async (sec) => {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

const displayStatus = (stage, player, monster) => {
  console.log(chalk.magentaBright(`\n============= Current Status =============`));
  console.log(
    chalk.cyanBright(` | Stage: ${stage} \n`),
    chalk.blueBright(
      `| [${player.name}] 체력: ${player.hp} 내공: ${player.atk} \n`,
    ),
    chalk.redBright(
      `| [${monster.name}] 체력: ${monster.hp} 내공: ${monster.atk} `,
    )
  );
  console.log(chalk.magentaBright(`==========================================\n`));
}

// const battleMenu = async (player, monster, choice) => {
// }

const battle = async (stage, player, monster) => {
  let logs = [];
  let turncnt = 0;
  logs.push(chalk.gray(`---------- 신규 스테이지 시작 ----------`));


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
            2. 천산갑   : ${player.defenseProb * 100}% 확률로 방어
            3. 초풍신권 : ${player.doubleatkProb * 100}% 확률로 2타
            4. 운기조식 : ${player.healProb * 100}% 확률로 회복
            5. 삼십육계 : ${player.runProb * 100}% 확률로 도망
            `,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');
    logs.push(chalk.magenta(`${choice} 번을 선택했구려`));
    logs.push(chalk.gray(`---------- 선택 완료 ----------`));

    switch (choice) {

      // 기본공격
      case '1':
        player.attack(monster);
        logs.push(chalk.green(`${player.name}의 공격! ${monster.name}에게 ${player.atk} 타격!`));
        logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        monster.attack(player);
        logs.push(chalk.redBright(`${monster.name}의 공격! ${player.name}에게 ${monster.atk} 타격!`));
        logs.push(chalk.yellow(`${player.name}의 체력이 ${player.hp} 남았소`))
        break;


      // 방어
      case '2':
        if (luk >= 1 - player.defenseProb) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 천산갑!"));
          player.defense(monster);
          logs.push(
            chalk.blueBright(`${monster.name}의 공격을 방어!\n`) +
            chalk.redBright(
              `${player.name}에게 ` + (monster.atk - player.defensePt) + ` 타격!`));
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
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 초풍신권!"));
          logs.push(chalk.blue(`내공이 온 몸에 넘쳐흘러 적에게 타격을 입지 않소`));
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
          logs.push(chalk.yellow(`${monster.name}의 체력이 ${monster.hp} 남았소.`))
        }
        break;

      case '5':
        logs.push(chalk.green("삼십육계를 시도하오"));
        if (luk >= 0.5) {
          console.log(chalk.grey(Math.round(luk * 100), "% 확률로 성공! 2초 뒤 입구로 이동하오"));
          await delay(2);
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


export const startGame = async () => {
  console.clear();
  console.log(chalk.grey(`\n======================= 서 두 ======================\n`));
  console.log(chalk.grey(`무림의 어느 민가에서 며칠만에 깨어난 당신`));
  await delay(0.5);
  console.log(chalk.grey(`강에 버려진 당신을 아들이 발견했다는 아낙의 말에`));
  await delay(0.5);
  console.log(chalk.grey(`당신과 함께 떠내려왔다는 보따리를 급히 열어본다`));
  await delay(0.5);
  console.log(chalk.grey("그 곳에는 ") +
    chalk.blue("물에 젖지 않은 서책 ") +
    chalk.grey("한 권이 있었고"));
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

    if (stage === 5 && monster.name === "시정잡배" && monster.hp <= 0) {

      console.log(chalk.cyan(`${monster.name}, 격파하였소!\n `));
      await delay(2);
      console.log(chalk.yellowBright(`...어?\n`));
      await delay(1);

      console.clear();
      console.log(`\n\n\n\n`);
      const keuk = chalk.redBright(`큭 `.repeat(6));
      console.log(keuk);
      await delay(2);

      console.log(
        chalk.grey(`
        \n기분 나쁜 웃음 소리와 함께 
        \n섬뜩한 인기척이 느껴진다
        \n정신을 다잡고 운기조식을...!!\n
        `));
      await delay(2);

      player.hp += 200;
      player.atk += 20;

      await movingText(`\n\n\n ROJIN`, "Henry 3D", chalk.magentaBright, 0.2);
      await delay(1);

      monster = new Monster("사파의 낭인", 200 + (stage * 15), 50 + (stage * 5));
      await battle(stage, player, monster);

    } else if (stage === 10 && monster.name === "시정잡배" && monster.hp <= 0) {

      console.log(chalk.cyan(`${monster.name}, 격파하였소! `));
      await delay(2);
      console.log(chalk.red(`\n. . . 그럴 리 없는 살기가 풍긴다.\n`));

      console.log(
        chalk.blue(`상대가 치고 들어오기 전에 손을 써야 한다. . . !\n\n`)
      )
      await delay(3);

      console.clear();
      console.log(
        chalk.green(
          `\n\n
          ${player.name}은 팔맥교회혈을 점혈합니다
          단전 깊은 곳에서 알 수 없는 소용돌이가 몰아칩니다
          \n\n`)
      );
      await delay(3);

      player.hp += (stage * 30);
      player.atk += (stage * 10);

      const kkal = chalk.redBright(`깔 `.repeat(8));
      console.log(kkal);
      await delay(3);

      console.log(
        chalk.red(`
          \n 노력은 가상하다만,
          \n 명계로 가는 시간만 단축할 뿐이다
          \n ${playerName}, 무림이 너를 모를 것이라 생각했나?
          `));
      await delay(3);
      
      console.log(`\n\n\n`)
      await movingText(`\n\n\n PYE-IN`, "Henry 3D", chalk.redBright, 0.3);
      await delay(1);

      monster = new Monster("쓰러져가는 폐인", 250 + (stage * 19), 100 + (stage * 5));
      await battle(stage, player, monster);

    }

    if (monster.hp <= 0) {
      console.log(chalk.cyan(`${monster.name}, 격파하였소!\n`));

      player.hp = 110 + Math.round(stage * 23);
      player.atk = 10 + Math.round(stage * 7.7);
      await delay(1);
    }

    // 스테이지 클리어 및 게임 종료 조건

    if (player.hp <= 0) {
      console.log(
        chalk.grey(`체력이 모두 소진되고 말았다......\n`) +
        chalk.red(`${player.name}은 쓰러졌다. . . !\n`) +
        chalk.grey(`
          \n아득해지는 감각 너머로 
          \n${monster.name}의 비웃음 소리가
          \n귓전에 소용돌이 친다......\n\n`)
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
      readlineSync.keyIn(`\n엔터 말고 아무 키나 눌러주시오 `);
      await delay(3);
      await start();

    }

    if (stage === 10 && monster.hp <= 0) {
      console.log(chalk.blue("=============== ALL STAGE CLEAR ==============="));
      console.log(
        chalk.white(
          figlet.textSync('CLEAR', {
            font: 'Henry 3D',
            horizontalLayout: 'fitted',
            verticalLayout: 'fitted',
          })
        )
      );
      console.log(chalk.blue("=============== 입구로 돌아가오 ==============="));
      readlineSync.keyIn(`\n 엔터 말고 아무 키나 눌러주시오  `);
      await delay(2);
      await start();

    }

    stage++;
  }
} 