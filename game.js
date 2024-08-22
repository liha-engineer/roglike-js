import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayLobby } from "./server.js";
import { handleUserInput } from "./server.js";

class Character {
  constructor(name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;
    this.luk = Math.random();
  }

  // hp와 atk()가 공통이니 뽑는것도?
  // this.을 붙여서 상태처럼 쓸 필요는 없다!
  // 그냥 데미지를 리턴하고 그 값을 hp에서 빼는 것도 가능!
  // 지금같은 구현이라면 바깥에서 데미지를 카운트해주는 무언가가 필요할것!
  // 함수 한개로 음수면 데미지, 양수면 힐로 구현할 수 있을 것! 

  hpChange(target) {
    const damage = this.atk;
    target.hp -= damage;
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
      `| 플레이어 정보: HP: ${player.hp} ATK: ${player.atk} |`,
    ) +
    chalk.redBright(
      `| 몬스터 정보: HP: ${monster.hp} ATK: ${monster.atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`======================\n`));
}


const battle = async (stage, player, monster) => {
  let logs = [];
  let turncnt = 0;

  while (player.hp > 0 && stage <= 10) {
    turncnt++;
    logs.push(chalk.green(`\n`));
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n{1: 공격한다, 2: 도망간다}`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.gray(`---------- 선택 완료 ----------`));
    logs.push(chalk.green(`${choice} 번을 선택하셨습니다.`));
    logs.push(chalk.gray(`---------- ${turncnt} 번째 턴 ----------`));

    switch (choice) {
      case '1':
        player.hpChange(monster);
        logs.push(chalk.green(`${monster.name}에게 ${player.atk} 만큼의 공격!`));
        logs.push(chalk.yellow(`${monster.name}의 HP가 ${monster.hp} 남았습니다.`))
        monster.hpChange(player);
        logs.push(chalk.redBright(`${player.name}에게 ${monster.atk} 만큼의 공격!`));
        logs.push(chalk.yellow(`${player.name}의 HP가 ${player.hp} 남았습니다.`))
        break;

      case '2':
        if (player.luk >= 0.5) {
          logs.push(chalk.green(Math.round(player.luk * 100), "% 의 확률로 도망쳤습니다"));
          displayLobby();
          handleUserInput();
        } else {
          logs.push(chalk.grey(Math.round(player.luk * 100), "%의 확률로 도망에 실패했습니다"));
          battle();
        }
        break;

      default:
        logs.push(chalk.magentaBright('올바른 번호를 선택해주세요.'));
        break;
      // 
    }


    if (monster.hp <= 0) {

      if (stage < 10) {
        logs.push(chalk.green(`몬스터를 물리쳤습니다!`));
        // 플레이어 스탯업
        player.hp = 110 + Math.round(stage * 25);
        player.atk = 10 + Math.round(stage * 7);
      } else {
        logs.push(chalk.cyan(`========== ALL GAME CLEAR ==========`));
        logs.push(chalk.cyan(`수고하셨습니다, ${player.name}`));
      }
      break;
    }

    if (player.hp <= 0) {
      logs.push(chalk.red('HP가 0이 되었습니다.'));
      logs.push(chalk.grey('========== GAME OVER =========='));

      break;
    }
  }
};


export async function startGame() {
  console.clear();
  const player = new Player("플레이어", 110, 10);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster("몬스터", 100 + ((stage - 1) * 15), 10 + ((stage - 1) * 8));
    await battle(stage, player, monster);
    // 스테이지 클리어 및 게임 종료 조건
    stage++;

  }


} 