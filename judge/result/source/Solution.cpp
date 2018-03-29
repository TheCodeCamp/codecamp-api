#include<iostream>
#include<cstdio>
#include<cstring>
#include<cstdlib>
#include<algorithm>
#include<cmath>
#include<set>
using namespace std;

const int M=500005;
const int N=50005;

int n,k;
struct node{
	int sz;
	int mn[11],mx[11];
	friend bool operator<(node a,node b){
		for (int i=1;i<=k;i++)
			if (a.mx[i]>b.mn[i]) return 0;
		return 1;
	}
}w;
set<node> st;
set<node>::iterator l,r;

int main(){
	scanf("%d%d",&n,&k);
	for (int i=1;i<=n;i++){
		w.sz=1;
		for (int j=1;j<=k;j++){
			scanf("%d",&w.mn[j]);
			w.mx[j]=w.mn[j];
		}
		l=st.lower_bound(w);
		r=st.upper_bound(w);
		while (l!=r){
			for (int j=1;j<=k;j++){
				w.mn[j]=min(w.mn[j],(*l).mn[j]);
				w.mx[j]=max(w.mx[j],(*l).mx[j]);
			}
			w.sz+=(*l).sz;
			st.erase(l++);
		}
		st.insert(w);
		printf("%d\n",(*st.rbegin()).sz);
	}
	return 0;
}
