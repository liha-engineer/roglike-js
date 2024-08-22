import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayLobby } from "./server.js";
import { handleUserInput } from "./server.js";

class Character {
  constructor(name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;
    this.maxatk = Math.round(atk * 1.4);
    this.dfs = Math.round(atk * 0.4);
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

  defense (target) {
    this.hp = this.hp - target.atk + this.dfs;
  }

}

class Player extends Character {

  }

class Monster extends Character {
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보: HP: ${player.hp} ATK: ${player.atk} `,
    ) +
    chalk.redBright(
      `| 몬스터 정보: HP: ${monster.hp} ATK: ${monster.atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`======================\n`));
}

function delay(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000))
  // 뭔진 모르겠는데 딜레이 주는 함수라고 민규님이 알려주심
}


const battle = async (stage, player, monster) => {
  let logs = [];
  let turncnt = 0;
  logs.push(chalk.gray(`---------- 신규 스테이지 시작 ----------`));

  while (player.hp > 0) {
    let luk = Math.random();
    turncnt++;

    console.clear();
    displayStatus(stage, player, monster);

    logs.push(chalk.green(`\n`));
    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n{1: 공격한다, 2: 방어한다(60%)  3: 연속공격(40%)  4: 도망간다}`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.gray(`---------- 선택 완료 ----------`));
    logs.push(chalk.magenta(`${choice} 번을 선택하셨습니다.`));
    logs.push(chalk.gray(`---------- ${turncnt} 번째 턴 ----------`));

    switch (choice) {
      case '1':
        player.attack(monster);
        logs.push(chalk.green(`${monster.name}에게 ${player.atk} 대미지!`));
        logs.push(chalk.yellow(`${monster.name}의 HP가 ${monster.hp} 남았습니다.`))
        monster.attack(player);
        logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 대미지!`));
        logs.push(chalk.yellow(`${player.name}의 HP가 ${player.hp} 남았습니다.`))
        break;

      case '2':
        if (luk >= 0.4) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 디펜스!"));
          player.defense(monster);
          logs.push(chalk.redBright(`${player.name}에게 ` + (monster.atk - player.dfs)  + ` 대미지!`)); 
          logs.push(chalk.yellow(`${player.name}의 HP가 ${player.hp} 남았습니다.`))
        } else {
          logs.push(chalk.grey("방어에 실패했다!"));
          monster.attack(player);
          logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 대미지!`));
          logs.push(chalk.yellow(`${player.name}의 HP가 ${player.hp} 남았습니다.`))

        }
        break;

      case '3':
        if (luk >= 0.6) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 의 확률로 연속공격!"));
          player.doubleAtk(monster);
          logs.push(chalk.green(`${monster.name}에게 `+ (player.maxatk * 2) + `대미지!`));
          logs.push(chalk.yellow(`${monster.name}의 HP가 ${monster.hp} 남았습니다.`))
        } else {
          logs.push(chalk.grey("연속공격에 실패하였습니다."));
          logs.push(chalk.green(`${monster.name}에게 ${player.atk} 대미지!`));
          player.attack(monster)
          logs.push(chalk.yellow(`${monster.name}의 HP가 ${monster.hp} 남았습니다.`))
        }
        break;

      case '4':
        logs.push(chalk.green("도망을 시도합니다"));
        if (luk >= 0.5) {
          logs.push(chalk.grey(Math.round(luk * 100), "% 확률로 도망쳤습니다! 5초 뒤 로비로 이동합니다"));
          delay(5);
          displayLobby();
          handleUserInput();
        } else {
          logs.push(chalk.grey(Math.round(luk * 100), "% 확률로 도망에 실패했습니다."));
          battle();
        }
        break;

      default:
        logs.push(chalk.red('올바른 번호를 선택해주세요.'));
        break;
      
    }

    if (monster.hp <= 0) {
      logs.forEach((log) => console.log(log));
      logs.push(chalk.cyan("몬스터를 물리쳤습니다!!"))
      // 플레이어 스탯업
      player.hp = 110 + Math.round(stage * 25);
      player.atk = 10 + Math.round(stage * 7.5);
      delay(5);
      break;
    }

    if (player.hp <= 0) {
      logs.forEach((log) => console.log(log));
      logs.push(chalk.red('HP가 0이 되었습니다.'));
      logs.push(chalk.grey('========== GAME OVER =========='));
      delay(5);
      break;
    }


    if (stage === 10 && monster.hp <= 0) {
      logs.forEach((log) => console.log(log));
      logs.push(chalk.cyan("========== ALL STAGE CLEAR =========="));
      delay(5);
      break;
    }

  }
};


export async function startGame() {
  console.clear();
  const player = new Player("플레이어", 110, 10);
  let stage = 1;

  while (stage < 10) {
    const monster = new Monster("몬스터", 50 + ((stage - 1) * 20), 10 + ((stage - 1) * 10));
    await battle(stage, player, monster);

    if (stage === 10) {
      const monster = new Monster ("아브렐슈드", 500, 90);
      await battle(stage, player, monster);
    }

    // 스테이지 클리어 및 게임 종료 조건

    stage++;
  }
} 