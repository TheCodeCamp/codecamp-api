import java.util.Scanner;

public class Test {

public static void main(String[] args) {
    // TODO Auto-generated method stub

    //insert input tool
    Scanner input = new Scanner(System.in);

    //create inventory object for gold and items
    int gold = 10;

    //create health points object 

    //address player with greeting
    System.out.println("Welcome to your adventure!");

    //ask for character name, race, and gender

    System.out.println("What will your adventurer's name be?");

    String Name = input.nextLine();

   

    //create test to verify validity of race selection

    boolean raceBoolean=true;
    String characterRace = "";

    

    try {

        do {

    //selection list that defines options
								 System.out.println("What will your adventurer's race be?");
								System.out.println("1. Human");
								System.out.println("2. Elf");
								System.out.println("3. Orc");
								System.out.println("4. Undead");

								int raceInt = input.nextInt();
								if (raceInt < 0 || raceInt > 4) {
        						raceBoolean = false;
 
        						}
        				else{
        						raceBoolean = true;
        					}

                if (raceInt == 1){
                    characterRace = "human";
                    
                    }
									
                else if (raceInt == 2)
                    characterRace = "elf";

                else if (raceInt == 3)
                    characterRace = "orc";

                else if (raceInt == 4)
                    characterRace = "undead";
                System.out.println(raceInt);

        }
        while (raceBoolean==false);
        }

            finally {

        }



    //ask for character gender
    System.out.println("What will your adventurer's gender be?");
    System.out.println("1. Male");
    System.out.println("2. Female");

    int genderInt = input.nextInt();

    String characterGender = "";

    if (genderInt == 1)
        characterGender = "male";

    else if (genderInt == 2)
        characterGender = "female";
		
		System.out.println(characterRace);
    //list out character description

    System.out.println("You are " + Name + ", a " + characterGender + " " + characterRace + ".");

    //introduce player to adventure with different introductions for different races

    System.out.print("You came to Glassolin with only ten gold pieces to your name. ");

    if (characterRace.equals("human"))
        System.out.print("Glassolin is home to many humans; some from the far reaches of the realm. You feel right at home, more or less,"
                + " as long as you ignore the occasional odd look from the cityfolk staring at someone dressed in farmer's clothes.");
    else if (characterRace.equals("elf"))
        System.out.print("While an elf isn't the most common sight around town, the locals seem like they don't care one way or another "
                + "about you wandering the streets. ");


}

}

