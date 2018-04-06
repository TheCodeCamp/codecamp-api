#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define test(t) ll t;cin>>t;while(t--)
#define in(n) ll n; cin>>n
#define in2(m,n) ll m,n; cin>>m>>n
#define f(i,a,b) for(ll i=0;i<b;i++)
#define fb(f,a,b) for(ll i=b;i>a;i--)
int main(void){
	test(t){
		in2(n,x);
		ll h[n+1],s[n];
		f(i,0,n)
			cin>>h[i];
		f(i,0,n)
			cin>>s[i];
		ll t=0,flag=0;
		h[n]=0;
		f(i,0,n){
			if(h[i]-h[i+1]<=x)
				t+=floor((h[i]-h[i+1])/10);
			else if(h[i]-h[i+1]-x<=s[i])
				t+=h[i]-h[i+1]-x+floor(abs(h[i]-h[i+1]-x)/10);
			else{
				flag++;
				break;
			}
			cout<<t<<endl;
		}
		if(flag)
			cout<<"impossible\n";
		else
			cout<<"possible\n"<<t<<endl;
	}
}