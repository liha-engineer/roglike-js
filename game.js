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
      `| ${player.name} 정보: HP: ${player.hp} ATK: ${player.atk} |`,
    ) +
    chalk.redBright(
      `| ${monster.name} 정보: HP: ${monster.hp} ATK: ${monster.atk} |`,
    ),
  );
  console.log(chalk.magentaBright(`======================\n`));
}


const battle = async (stage, player, monster) => {
  let logs = [];

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { displayLobby } from "./server.js";

class Character {
  constructor(hp, atk) {
    this.hp = hp;
    this.atk = atk;
  }

  attack(target) {
    const damage = Math.round(Math.random() * 10);
    target.hp -= damage;
    return console.log(chalk.redBright(`${damage} 만큼의 공격!`));
  }
  // hp와 atk()가 공통이니 뽑는것도?
  // this.을 붙여서 상태처럼 쓸 필요는 없다!
  // 그냥 데미지를 리턴하고 그 값을 hp에서 빼는 것도 가능!
  // 지금같은 구현이라면 바깥에서 데미지를 카운트해주는 무언가가 필요할것!
  // 함수 한개로 음수면 데미지, 양수면 힐로 구현할 수 있을 것! 

}

class Player extends Character {

  run() {
    this.runprob = Math.random() * 10;
    if (this.runprob >= 0.5) {
      console.log(chalk.green(Math.round(this.runprob), "의 확률로 도망쳤습니다"));
      displayLobby();
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

  while (player.hp > 0) {
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
        break;

      case '2':
        player.run();
        break;

      default:
        console.log(chalk.red('올바른 번호를 선택해주세요.'));
        battle(); // 
    }

    if (monster.hp <= 0) {
      console.log(chalk.green(`몬스터를 물리쳤습니다!`));

      // 플레이어 스탯업
      player.hp = player.hp + (1 + (Math.random() * 150));
      player.atk = player.atk + (1 + (Math.random() * 20));

      // 몬스터 스탯업

      monster.hp = monster.hp + (1 + (Math.random() * 100));
      monster.atk = monster.atk + (1 + (Math.random() * 15));

      break;

    }
  }
};

export async function startGame() {
  console.clear();
  const player = new Player(100, 10);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(100, 10);
    await battle(stage, player, monster);


    // 스테이지 클리어 및 게임 종료 조건
    stage++;

    if (stage > 11) {
      console.log(chalk.green(`========== ALL GAME CLEAR ==========`));
      displayLobby(); 
    }

  }
}

    logs.forEach((log) => console.log(log));
    //이건 forEach문 안에 매개변수로 들어간 콜백함수가 화살표함수 형태로 표시된 것.
    // logs 안을 순환하면서 구성요소인 log를 꺼내오겠다는 것 

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
        battle();
    };

    if (monster.hp < 0) {
      await console.log(chalk.green(`몬스터를 물리쳤습니다!`));

      // 플레이어 스탯업
      player.hp = Math.round(player.hp + (Math.random() * 150));
      player.atk = Math.round(player.atk + (Math.random() * 12));

      break;
    };

    if (player.hp <= 0 ) {
      console.log(chalk.redBright(`HP가 0이 되었습니다.`));
      console.log(chalk.cyan(`========== GAME OVER ==========`));
      break;
    };
  };
};

export async function startGame() {
  console.clear();
  const player = new Player("플레이어", 100, 10);
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster("몬스터" ,100, 10);
    await battle(stage, player, monster);
    // 스테이지 클리어 및 게임 종료 조건
    stage++;
    monster.hp = Math.round(100 + ((stage - 1) * (Math.random())));
    monster.atk = Math.round(10 + ((stage - 1) * (Math.random())));

    if (stage > 11) {
      console.log(chalk.green(`========== ALL GAME CLEAR ==========`));
      displayLobby();
      handleUserInput();
      break;
    }
  }
} 