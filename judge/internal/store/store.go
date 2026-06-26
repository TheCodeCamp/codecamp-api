// Package store provides read access to the submissions and problems that the
// Node API server writes into MongoDB. The judge only reads.
package store

import (
	"context"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Solution mirrors the fields of the Node `solutions` collection the judge needs.
type Solution struct {
	ID          string `bson:"id"`
	Username    string `bson:"username"`
	Contest     string `bson:"contest"`
	Problem     string `bson:"problem"`
	Language    string `bson:"language"`
	Description string `bson:"description"` // base64-encoded source
}

// Problem mirrors the judging-relevant fields of the `problems` collection.
type Problem struct {
	Code        string `bson:"code"`
	TimeLimitMs int64  `bson:"timelimit"`
	SourceLimit int64  `bson:"sourcelimit"`
}

type Store struct {
	client *mongo.Client
	db     *mongo.Database
}

// Connect dials MongoDB and verifies the connection.
func Connect(ctx context.Context, uri string) (*Store, error) {
	cctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(cctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}
	if err := client.Ping(cctx, nil); err != nil {
		return nil, err
	}
	return &Store{client: client, db: client.Database(dbName(uri))}, nil
}

// Ping checks connectivity (used by /health).
func (s *Store) Ping(ctx context.Context) error {
	cctx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()
	return s.client.Ping(cctx, nil)
}

// SolutionByID returns the submission with the given id, or nil if absent.
func (s *Store) SolutionByID(ctx context.Context, id string) (*Solution, error) {
	var sol Solution
	err := s.db.Collection("solutions").FindOne(ctx, bson.M{"id": id}).Decode(&sol)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &sol, nil
}

// ProblemByCode returns the problem with the given code, or nil if absent.
func (s *Store) ProblemByCode(ctx context.Context, code string) (*Problem, error) {
	var p Problem
	err := s.db.Collection("problems").FindOne(ctx, bson.M{"code": code}).Decode(&p)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// dbName extracts the database name from a Mongo connection string, defaulting
// to OnlineJudge when none is present.
func dbName(uri string) string {
	s := uri
	if i := strings.IndexByte(s, '?'); i >= 0 {
		s = s[:i]
	}
	s = strings.TrimRight(s, "/")
	if i := strings.LastIndexByte(s, '/'); i >= 0 && i+1 < len(s) {
		if seg := s[i+1:]; !strings.Contains(seg, ":") {
			return seg
		}
	}
	return "OnlineJudge"
}
