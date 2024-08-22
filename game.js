import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayLobby } from "./server.js";
import { handleUserInput } from "./server.js";

class Character {
  constructor(name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;
  }

  attack(target) {
    const damage = this.atk;
    target.hp -= damage;
    if (target.name === "몬스터") {
      console.log(chalk.green(`${target.name}에게 ${damage} 만큼의 공격!`));
    } else {console.log(chalk.redBright(`${target.name}에게 ${damage} 만큼의 공격!`));}
  }
  // hp와 atk()가 공통이니 뽑는것도?
  // this.을 붙여서 상태처럼 쓸 필요는 없다!
  // 그냥 데미지를 리턴하고 그 값을 hp에서 빼는 것도 가능!
  // 지금같은 구현이라면 바깥에서 데미지를 카운트해주는 무언가가 필요할것!
  // 함수 한개로 음수면 데미지, 양수면 힐로 구현할 수 있을 것! 

}

class Player extends Character {
  runAway() {
    this.runprob = Math.random() * 10;
    if (this.runprob >= 0.5) {
      console.log(chalk.green(Math.round(this.runprob), "의 확률로 도망쳤습니다"));
    } else {
      console.log(chalk.grey(Math.round(this.runprob), "의 확률로 도망에 실패했습니다"));
      battle();
    }
  }
};

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

  while (player.hp > 0 && stage <= 10) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 도망간다`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    console.log(chalk.green(`${choice}를 선택하셨습니다.`));

    switch (choice) {
      case '1':
        player.attack(monster);
        monster.attack(player);
        break;

      case '2':
        player.runAway();
        break;

      default:
        console.log(chalk.red('올바른 번호를 선택해주세요.'));
        // 
    }

    if (monster.hp <= 0) {
      console.log(chalk.green(`몬스터를 물리쳤습니다!`));

      // 플레이어 스탯업
      player.hp = 110 + Math.round(stage * 17);
      player.atk = 10 + Math.round(stage * 1.7);

      // 몬스터 스탯업

      monster.hp = 100 + Math.round(stage * 13);
      monster.atk = 10 + Math.round(stage * 1.3);
      break;
    }


  }
};


export async function startGame() {
  console.clear();
  const player = new Player("플레이어", 110, 10);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster("몬스터" ,100, 10);
    await battle(stage, player, monster);
    // 스테이지 클리어 및 게임 종료 조건
    stage++;

  }

  if (stage === 10 && monster.hp === 0) {
    console.log(chalk.cyan(`========== ALL GAME CLEAR ==========`));
    console.log(chalk.cyan(`수고하셨습니다, ${player.name}`));
    displayLobby();
    handleUserInput();
  }

} 