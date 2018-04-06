import java.io.*;
import java.util.*;
public class Solution		//String wala
{
	public static void main(String args[])throws IOException
	
	{
		BufferedReader br= new BufferedReader(new InputStreamReader(System.in));
		PrintWriter out= new PrintWriter(System.out);
		int t= Integer.parseInt(br.readLine());
		int i, j;
		while(t-->0)
		{
			StringTokenizer str= new StringTokenizer(br.readLine());
			int n= Integer.parseInt(str.nextToken());
			long k= Long.parseLong(str.nextToken());
			String ans[] = new String[n+1];
			ans[0]="a";
			ans[1]="b";
			ans[2]="c";
			if(n>=3)
			{
			for(i=3; i<=n; i++)
			{
				ans[i]= ans[i-1]+ans[i-2]+ans[i-3];
			}
			}
			String ch="";
			if(k<=ans[n].length())
			 ch= Character.toString(ans[n].charAt((int)k-1));
				else
				ch="-1";
			System.out.println(ch);
			
		}
		out.flush();
	}
	public static String f(int N) 
	{
		if (N == 0) return "a";
		if (N == 1) return "b";
		if (N == 2) return "c";
		return f(N - 1) + f(N - 2) + f(N - 3);
	}
}