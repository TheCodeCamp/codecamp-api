package store

import "testing"

func TestDBName(t *testing.T) {
	cases := []struct{ uri, want string }{
		{"mongodb://127.0.0.1:27017/OnlineJudge", "OnlineJudge"},
		{"mongodb://127.0.0.1:27017/OnlineJudge?retryWrites=true", "OnlineJudge"},
		{"mongodb://user:pass@host:27017/mydb", "mydb"},
		{"mongodb://127.0.0.1:27017", "OnlineJudge"},   // no db => default
		{"mongodb://127.0.0.1:27017/", "OnlineJudge"},  // trailing slash, no db
		{"mongodb+srv://host/prod?w=majority", "prod"}, // srv form
	}
	for _, c := range cases {
		if got := dbName(c.uri); got != c.want {
			t.Errorf("dbName(%q) = %q, want %q", c.uri, got, c.want)
		}
	}
}
