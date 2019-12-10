class CreateFollows < ActiveRecord::Migration[5.2]
  def change
    create_table :follows do |t|
      t.integer :user_id, null: false
      t.integer :following_id, null: false

      t.timestamps
    end
     add_index :follows, [:user_id, :following_id], unique: true
  end
end
