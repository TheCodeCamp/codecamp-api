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
