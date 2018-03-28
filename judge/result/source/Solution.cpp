#include<stdio.h>
int main()
{
	int t,m,count=0,imt,i;
	long long temp;
	scanf("%d",&t);
	//if((t>0)&&(t<6))
	{
	while(t--)
	{
		scanf("%d",&m);
		long long a[m];
		for(i=0;i<m;i++)
		{
			scanf("%lld",&a[i]);
			//if(i>0&&temp==1)
		} 
		count=0;
		temp=a[0];
		for(i=0;i<m-1;i++)
		{
			if((a[i]!=temp)||(a[i]!=a[i+1]))
			count++;
			temp=a[i];
		}
		if(a[i]!=temp)
		count++;
		printf("%d\n",count);
		
	}
}
	return 0;
} 