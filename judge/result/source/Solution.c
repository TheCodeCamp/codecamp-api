#include<stdio.h>
#include<stdlib.h>
#include<string.h>

int main()
{
    int t,a[26],i,odd;
    char ch[1000010];
    scanf("%d",&t);
    while(t--)
    {
        scanf("%s",ch);
        memset(a,0,sizeof(a));
        odd=0;
        for(i=0;ch[i]!='\0';i++)
            a[(int)(ch[i])-97]+=1;
        for(i=0;i<26;i++)
            if(a[i]%2)
                odd+=1;
        if(odd<2)
            printf("0\n");
        else
            printf("%d\n",odd-1);
    }
}
