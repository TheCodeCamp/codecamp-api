#include <stdio.h>
#include <string.h>
int main()
{
    char S[100002];
    long int T;
    int i,t1,t2,l;
    scanf("%ld",&T);
    while(T)
    {
        T--;
        t1=t2=0;
       scanf("%s",S);
       l=strlen(S);
       for(i=0;i<l;i++){
        if(S[i]=='a'|| S[i]=='e'||S[i]=='i'||S[i]=='o'||S[i]=='u'||S[i]=='A'||S[i]=='E'||S[i]=='I'||S[i]=='O'||S[i]=='U')
            t1++;
        else t2++;
       }
       if(t1>=t2)
        printf("GOOD\n");
       else
        printf("BAD\n");
    }
    return 0;
}
