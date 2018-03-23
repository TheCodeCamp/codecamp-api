<<<<<<< HEAD
public class Solution
{
     public static void main(String args[])throws IOException
     {
         Scanner in= new Scanner(System.in);
         int t= in.nextInt();
         long i;
         while(t-->0)
         {
             long n= in.nextLong();
             long m= in.nextLong();
             long a[]= new long[(int)m];
             boolean joined[]= new boolean[(int)m];
             for(i=0; i<m; i++)
             {
                 a[(int)i]= in.nextLong();
                 joined[(int)i]= false;
             }
             Arrays.sort(a);
             long count=0, index=m-1;
             for(i=0; i<m; i++)
             {
                 while(i<m && a[(int)i]!=0 && joined[(int)i]==false)
                 {
                     a[(int)i]--;
                     count++;
                     joined[(int)index]=true;
                     joined[(int)index-1]=true;
                     index--;
                 }
             }
             System.out.println(count);
         }
     }
 }
=======
import java.util.*;
import java.lang.Math;
class ordteams
{
	static boolean comp(int x[],int y[])
	{
		if(x[0]>y[0])
		{
			
			if(x[1]>=y[1])
			{
				if(x[2]>=y[2])
				{return true;}
				else
				{return false;}
			}
			else
			{
				return false;
			}
		}
		else if(x[0]==y[0])
		{
			if(x[1]>=y[1])
			{
				if(x[2]>y[2])
				{return true;}
				else
				{
					if(x[1]==y[1]&&x[2]<y[2]){return true;}
					else if(x[1]==y[1]&&x[2]==y[2]){return false;}
					else{return false;}
				}
			}	
			else
			{
				if(x[2]<=y[2]){return true;}
				else{return false;}		
			}
		}
		else
		{
			if(x[1]<=y[1])
			{
				if(x[2]<=y[2])
				{
					return true;
				}
				else{return false;}
			}
			else{return false;}
		}
	}
	public static void main(String args[])
	{
		Scanner scan=new Scanner(System.in);
		int t=scan.nextInt();
		for(int i=0;i<t;i++)
		{
			int f=0;
			int a[]=new int[3];
			int b[]=new int[3];
			int c[]=new int[3];
			while(scan.hasNext())
			{
				f++;
				if(f==1){a[0]=scan.nextInt();}
				if(f==2){a[1]=scan.nextInt();}
				if(f==3){a[2]=scan.nextInt();}
				if(f==4){b[0]=scan.nextInt();}
				if(f==5){b[1]=scan.nextInt();}
				if(f==6){b[2]=scan.nextInt();}
				if(f==7){c[0]=scan.nextInt();}
				if(f==8){c[1]=scan.nextInt();}
				if(f==9){c[2]=scan.nextInt();}
				if(f==9){break;}
			}
			if(comp(a,b)&&comp(b,c)&&comp(a,c))
			{
				
				System.out.println("yes");
			}
			else
			{
				System.out.println("no");
			}
		
			
		}
	}
} 
>>>>>>> 6b9a84523259144e34994839aeeb1470ef83ebe7
