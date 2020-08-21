'use strict';
const mongoose = require('mongoose');
const { Schema } = mongoose;
const assert = require('assert');


run().catch(console.error);

async function run() {
	await mongoose.connect('mongodb://localhost:27017/test', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	await mongoose.connection.dropDatabase();

	const postSchema = new Schema({
		title: String,
		comments: [{ 
			type: Schema.ObjectId, 
			ref: 'Comment' 
		}],
		user : {
			type: Number,
			default: 0
		},
		date: {
			type: Date,
			default: () => Date.now()
		}
	});
	const Post = mongoose.model('Post', postSchema);

	const commentSchema = new Schema({ content: String });
	const Comment = mongoose.model('Comment', commentSchema);


	await createFirstPost(Post, Comment);
	await createSecondPost(Post, Comment);

	// Edited line
	const posts = await Post.find({user: {$in :[0]}, date: { $lt: Date.now() } })
		.sort('-date')
		.limit(2)
		.populate({
			path: 'comments',
			// select: 'content -_id',
			perDocumentLimit: 2
		});
	console.log(posts);
	assert.equal(posts[0].comments.length, 2);
	assert.equal(posts[1].comments.length, 2);

	console.log('All assertions passed.');
}


async function createFirstPost(Post, Comment) {
	const post = new Post({ title: 'I have 3 comments' });

	const comment1 = new Comment({ content: 'Cool first post' });
	const comment2 = new Comment({ content: 'Very cool first post' });
	const comment3 = new Comment({ content: 'Super cool first post' });

	post.comments = [comment1, comment2, comment3].map(comment => comment._id);
	await Promise.all([
		post.save(),
		comment1.save(),
		comment2.save(),
		comment3.save()
	]);
}

async function createSecondPost(Post, Comment) {
	const post = new Post({ title: 'I have 4 comments' });

	const comment1 = new Comment({ content: 'Cool second post' });
	const comment2 = new Comment({ content: 'Very cool second post' });
	const comment3 = new Comment({ content: 'Super cool second post' });
	const comment4 = new Comment({ content: 'Absolutely cool second post' });

	post.comments = [comment1, comment2, comment3, comment4].map(comment => comment._id);
	await Promise.all([
		post.save(),
		comment1.save(),
		comment2.save(),
		comment3.save(),
		comment4.save()
	]);
}